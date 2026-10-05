from django.db import models
from django.utils.text import slugify
from django.urls import reverse
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
import os

CATEGORY_CHOICES = [
    ('Games', 'Games'),
    ('Productivity', 'Productivity'),
    ('Tools', 'Tools'),
    ('Social', 'Social'),
    ('Entertainment', 'Entertainment'),
    ('Finance', 'Finance'),
    ('Photography', 'Photography'),
    ('Health & Fitness', 'Health & Fitness'),
]

DEMAND_STATUS_CHOICES = [
    ('Pending', 'Pending Review'),
    ('In Review', 'In Review'),
    ('Approved', 'Approved'),
    ('In Development', 'In Development'),
    ('Rejected', 'Rejected'),
]

PLATFORM_CHOICES = [
    ('Android', 'Android (APK)'),
    ('iOS', 'iOS (Swift)'),
    ('Cross-Platform', 'Cross-Platform (Flutter / React Native)'),
    ('Web App', 'Web Application / PWA'),
]

def app_icon_upload_path(instance, filename):
    return f"icons/{instance.package_name}/{filename}"

def app_banner_upload_path(instance, filename):
    return f"banners/{instance.package_name}/{filename}"

def apk_upload_path(instance, filename):
    return f"apks/{instance.package_name}/{filename}"


class App(models.Model):
    """
    Hadi88 Apps - Core Application Model
    """
    app_name = models.CharField(max_length=150, verbose_name="Application Name")
    package_name = models.SlugField(max_length=150, unique=True, verbose_name="Package Name (Slug)")
    developer_name = models.CharField(max_length=120, default="Hadi88 Studio", verbose_name="Developer Name")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Tools', db_index=True)
    app_icon = models.ImageField(upload_to=app_icon_upload_path, verbose_name="App Icon (512x512)")
    banner_image = models.ImageField(upload_to=app_banner_upload_path, blank=True, null=True, verbose_name="Featured Banner (16:9)")
    description = models.TextField(verbose_name="Full Description")
    version = models.CharField(max_length=20, default="1.0.0", verbose_name="Version")
    apk_file = models.FileField(
        upload_to=apk_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['apk', 'xapk', 'zip'])],
        verbose_name="APK Binary Package"
    )
    file_size = models.CharField(max_length=20, default="25 MB", verbose_name="File Size (e.g. 45 MB)")
    downloads_count = models.PositiveIntegerField(default=0, db_index=True, verbose_name="Total Downloads")
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=4.50,
        validators=[MinValueValidator(1.00), MaxValueValidator(5.00)],
        verbose_name="Rating (1.00 - 5.00)"
    )
    is_featured = models.BooleanField(default=False, help_text="Showcase in hero carousel")
    is_published = models.BooleanField(default=True, help_text="Publicly visible in store")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-downloads_count', '-created_at']
        verbose_name = "Application"
        verbose_name_plural = "Applications"

    def __str__(self):
        return f"{self.app_name} (v{self.version}) - {self.developer_name}"

    def save(self, *args, **kwargs):
        if not self.package_name:
            self.package_name = f"com.hadi88.{slugify(self.app_name).replace('-', '')}"
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('app_detail', kwargs={'package_name': self.package_name})

    @property
    def formatted_downloads(self):
        if self.downloads_count >= 1_000_000:
            return f"{self.downloads_count / 1_000_000:.1f}M+"
        elif self.downloads_count >= 1_000:
            return f"{self.downloads_count / 1_000:.0f}K+"
        return str(self.downloads_count)


class AppDemand(models.Model):
    """
    Hadi88 Apps - On-Demand Custom App Requests from Users
    "Find and ask for your dreaming apps"
    "We are building app on your demand"
    """
    user_name = models.CharField(max_length=120, verbose_name="User Name")
    email = models.EmailField(verbose_name="User Email")
    contact_method = models.CharField(
        max_length=20, 
        choices=[('Email', 'Email'), ('WhatsApp', 'WhatsApp'), ('Telegram', 'Telegram')],
        default='Email'
    )
    contact_handle = models.CharField(max_length=100, blank=True, verbose_name="Phone / Username Handle")
    app_title = models.CharField(max_length=150, verbose_name="Dreaming App Concept Title")
    platform = models.CharField(max_length=30, choices=PLATFORM_CHOICES, default='Android')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Productivity')
    requirements = models.TextField(verbose_name="Detailed App Requirements & Workflows")
    timeline = models.CharField(max_length=50, default="2-4 Weeks", verbose_name="Desired Delivery Timeline")
    budget = models.CharField(max_length=50, default="$1,000 - $3,000", verbose_name="Estimated Budget")
    status = models.CharField(max_length=30, choices=DEMAND_STATUS_CHOICES, default='Pending', db_index=True)
    legal_policy_agreed = models.BooleanField(
        default=False,
        help_text="User strictly affirmed that requested app contains no illegal, pirated, or theft material."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Client App Demand"
        verbose_name_plural = "Client App Demands"

    def __str__(self):
        return f"{self.app_title} by {self.user_name} [{self.status}]"
