from django.urls import path
from .views import CreateCheckoutSessionView, WebhookView

urlpatterns = [
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path("webhook/", WebhookView.as_view(), name="stripe-webhook"),
]