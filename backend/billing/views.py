import logging

import stripe
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)


def stripe_get(obj, key, default=None):
    if obj is None:
        return default

    if isinstance(obj, dict):
        return obj.get(key, default)

    if hasattr(obj, "get"):
        try:
            return obj.get(key, default)
        except Exception:
            pass

    return getattr(obj, key, default)


def metadata_get(metadata, key, default=None):
    if not metadata:
        return default

    if isinstance(metadata, dict):
        return metadata.get(key, default)

    if hasattr(metadata, "get"):
        try:
            return metadata.get(key, default)
        except Exception:
            pass

    return getattr(metadata, key, default)


def get_user_id_from_checkout_session(session):
    metadata = stripe_get(session, "metadata") or {}

    user_id = metadata_get(metadata, "user_id")
    if user_id:
        return str(user_id)

    client_reference_id = stripe_get(session, "client_reference_id")
    if client_reference_id:
        return str(client_reference_id)

    return None


def checkout_session_is_paid_or_complete(session):
    session_status = stripe_get(session, "status")
    payment_status = stripe_get(session, "payment_status")

    return session_status == "complete" or payment_status == "paid"


def upgrade_user_by_id(user_id):
    from users.models import User

    user = User.objects.get(id=user_id)
    user.tier = User.Tier.PAID
    user.save(update_fields=["tier"])

    print("Stripe upgraded user:", user.id, user.email, user.tier)

    return user


def upgrade_user_from_checkout_session(session):
    user_id = get_user_id_from_checkout_session(session)

    if not user_id:
        print("Stripe checkout missing user id")
        print("session id:", stripe_get(session, "id"))
        print("metadata:", stripe_get(session, "metadata"))
        print("client_reference_id:", stripe_get(session, "client_reference_id"))
        return None, "Missing user id"

    if not checkout_session_is_paid_or_complete(session):
        print(
            "Stripe checkout not paid/complete:",
            "session id=", stripe_get(session, "id"),
            "status=", stripe_get(session, "status"),
            "payment_status=", stripe_get(session, "payment_status"),
        )
        return None, "Checkout session is not paid or complete"

    try:
        user = upgrade_user_by_id(user_id)
    except Exception as e:
        print("Stripe failed to upgrade user:", user_id, repr(e))
        return None, str(e)

    return user, None


def retrieve_checkout_session(session_id):
    return stripe.checkout.Session.retrieve(session_id)


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan = request.data.get("plan", "lifetime")

        price_id = (
            settings.STRIPE_LIFETIME_PRICE_ID
            if plan == "lifetime"
            else settings.STRIPE_MONTHLY_PRICE_ID
        )

        user_metadata = {
            "user_id": str(request.user.id),
            "plan": plan,
        }

        try:
            checkout_kwargs = {
                "payment_method_types": ["card"],
                "line_items": [{"price": price_id, "quantity": 1}],
                "mode": "payment" if plan == "lifetime" else "subscription",
                "success_url": f"{settings.FRONTEND_URL}/dashboard?upgraded=true",
                "cancel_url": f"{settings.FRONTEND_URL}/dashboard?upgraded=false",
                "client_reference_id": str(request.user.id),
                "metadata": user_metadata,
            }

            if plan == "lifetime":
                checkout_kwargs["payment_intent_data"] = {
                    "metadata": user_metadata,
                }
            else:
                checkout_kwargs["subscription_data"] = {
                    "metadata": user_metadata,
                }

            session = stripe.checkout.Session.create(**checkout_kwargs)

            return Response({"url": session.url})

        except Exception as e:
            print("Stripe create checkout failed:", repr(e))
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class VerifyCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        session_id = request.data.get("session_id")

        if not session_id:
            return Response(
                {"detail": "Missing session_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            session = retrieve_checkout_session(session_id)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session_user_id = get_user_id_from_checkout_session(session)

        if session_user_id != str(request.user.id):
            return Response(
                {"detail": "Checkout session does not belong to this user"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user, error = upgrade_user_from_checkout_session(session)

        if error:
            return Response(
                {"detail": error},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "detail": "Subscription verified",
                "tier": user.tier,
            }
        )


@method_decorator(csrf_exempt, name="dispatch")
class WebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                settings.STRIPE_WEBHOOK_SECRET,
            )
        except ValueError as e:
            print("Stripe webhook invalid payload:", repr(e))
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            print("Stripe webhook signature error:", repr(e))
            return HttpResponse(status=400)

        event_type = event["type"]
        obj = event["data"]["object"]

        print("Stripe webhook received:", event_type)

        if event_type == "checkout.session.completed":
            try:
                session_id = stripe_get(obj, "id")
                session = retrieve_checkout_session(session_id)
                user, error = upgrade_user_from_checkout_session(session)

                if error:
                    print("Stripe checkout upgrade error:", error)

            except Exception as e:
                print("Stripe checkout webhook crashed:", repr(e))

            return HttpResponse(status=200)

        return HttpResponse(status=200)