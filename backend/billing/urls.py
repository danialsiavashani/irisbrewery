from django.urls import path

from .views import CreateCheckoutSessionView, VerifyCheckoutSessionView, WebhookView

urlpatterns = [
    path(
        "create-checkout-session/",
        CreateCheckoutSessionView.as_view(),
        name="create-checkout-session",
    ),
    path(
        "verify-checkout-session/",
        VerifyCheckoutSessionView.as_view(),
        name="verify-checkout-session",
    ),
    path(
        "webhook/",
        WebhookView.as_view(),
        name="stripe-webhook",
    ),
]