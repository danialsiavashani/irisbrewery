import stripe
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        plan = request.data.get("plan", "lifetime")

        price_id = (
            settings.STRIPE_LIFETIME_PRICE_ID
            if plan == "lifetime"
            else settings.STRIPE_MONTHLY_PRICE_ID
        )

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode="payment" if plan == "lifetime" else "subscription",
                success_url=f"{settings.FRONTEND_URL}/dashboard?upgraded=true",
                cancel_url=f"{settings.FRONTEND_URL}/dashboard?upgraded=false",
                metadata={"user_id": str(request.user.id)},
            )
            return Response({"url": session.url})
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_exempt, name="dispatch")
class WebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            return HttpResponse(status=400)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            user_id = session.metadata.get("user_id") if session.metadata else None

            if user_id:
                from users.models import User
                try:
                    user = User.objects.get(id=user_id)
                    user.tier = "paid"
                    user.save(update_fields=["tier"])
                except User.DoesNotExist:
                    pass

        return HttpResponse(status=200)