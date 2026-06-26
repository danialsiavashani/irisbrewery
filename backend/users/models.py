from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    class Tier(models.TextChoices):
        FREE = "free", "Free"
        PAID = "paid", "Paid"

    tier = models.CharField(
        max_length=10,
        choices=Tier.choices,
        default=Tier.FREE,
    )
    generations_used_today = models.PositiveIntegerField(default=0)
    last_generation_reset = models.DateField(default=timezone.localdate)