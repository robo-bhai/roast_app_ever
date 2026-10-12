from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
from django.http import HttpResponse, Http404
from django.contrib.staticfiles import finders
import os

# Ultra-safe static resolution: checks finders (Django packages like admin), STATIC_ROOT, static, and public
def safe_static_serve(request, path, insecure=True):
    # 1. First check Django's staticfiles finders (finds django.contrib.admin and all app static directly from installed packages)
    try:
        matched_file = finders.find(path)
        if matched_file and os.path.exists(matched_file):
            return serve(request, os.path.basename(matched_file), document_root=os.path.dirname(matched_file))
    except Exception:
        pass

    # 2. Check STATIC_ROOT (where collectstatic put admin CSS, JS, etc.)
    if settings.STATIC_ROOT and os.path.exists(os.path.join(settings.STATIC_ROOT, path)):
        return serve(request, path, document_root=settings.STATIC_ROOT)

    # 3. Check BASE_DIR / 'static'
    static_dir = os.path.join(settings.BASE_DIR, 'static')
    if os.path.exists(os.path.join(static_dir, path)):
        return serve(request, path, document_root=static_dir)

    # 4. Check BASE_DIR / 'public'
    public_dir = os.path.join(settings.BASE_DIR, 'public')
    if os.path.exists(os.path.join(public_dir, path)):
        return serve(request, path, document_root=public_dir)

    # 5. Check if it's an admin CSS/JS requested specifically
    if path.startswith('admin/'):
        admin_cand = finders.find(path)
        if admin_cand and os.path.exists(admin_cand):
            return serve(request, os.path.basename(admin_cand), document_root=os.path.dirname(admin_cand))

    # Fallback to static_dir or STATIC_ROOT
    doc_root = settings.STATIC_ROOT if (settings.STATIC_ROOT and os.path.exists(settings.STATIC_ROOT)) else static_dir
    return serve(request, path, document_root=doc_root)

# Ultra-safe media resolution: checks MEDIA_ROOT, apks, public/images, and static/images
def safe_media_serve(request, path, insecure=True):
    # 1. Standard MEDIA_ROOT
    if os.path.exists(os.path.join(settings.MEDIA_ROOT, path)):
        return serve(request, path, document_root=settings.MEDIA_ROOT)

    # 2. Check if it's an APK requested and exists in apks/
    if path.startswith('apks/'):
        filename = os.path.basename(path)
        apks_dir = os.path.join(settings.BASE_DIR, 'apks')
        if os.path.exists(os.path.join(apks_dir, filename)):
            return serve(request, filename, document_root=apks_dir)

    # 3. Check if file exists in public/images
    clean_filename = os.path.basename(path)
    pub_img = os.path.join(settings.BASE_DIR, 'public', 'images', clean_filename)
    if os.path.exists(pub_img):
        return serve(request, clean_filename, document_root=os.path.join(settings.BASE_DIR, 'public', 'images'))

    # 4. Check if file exists in static/images
    stat_img = os.path.join(settings.BASE_DIR, 'static', 'images', clean_filename)
    if os.path.exists(stat_img):
        return serve(request, clean_filename, document_root=os.path.join(settings.BASE_DIR, 'static', 'images'))

    # 5. Check if file exists in media/icons or media/banners directly
    direct_candidates = [
        os.path.join(settings.MEDIA_ROOT, 'icons', clean_filename),
        os.path.join(settings.MEDIA_ROOT, 'banners', clean_filename),
        os.path.join(settings.BASE_DIR, 'media', 'icons', clean_filename),
        os.path.join(settings.BASE_DIR, 'media', 'banners', clean_filename),
    ]
    for cand in direct_candidates:
        if os.path.exists(cand):
            return serve(request, clean_filename, document_root=os.path.dirname(cand))

    # 6. Fallback for missing icon or image: return dynamic valid SVG to prevent 404
    if any(path.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico']):
        initials = clean_filename[:2].upper() if clean_filename else 'HD'
        svg = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">'
            f'<rect width="128" height="128" rx="28" fill="#1f140e" />'
            f'<rect x="4" y="4" width="120" height="120" rx="24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.4" />'
            f'<text x="64" y="73" font-family="sans-serif" font-size="32" font-weight="900" fill="#fcd34d" text-anchor="middle" dominant-baseline="middle">{initials}</text>'
            f'</svg>'
        )
        return HttpResponse(svg, content_type='image/svg+xml')

    # Default to MEDIA_ROOT
    return serve(request, path, document_root=settings.MEDIA_ROOT)

# Priority: static & media first, then admin, then store views
urlpatterns = [
    re_path(r'^static/(?P<path>.*)$', safe_static_serve),
    re_path(r'^staticfiles/(?P<path>.*)$', safe_static_serve),
    re_path(r'^media/(?P<path>.*)$', safe_media_serve),
    re_path(r'^images/(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'public', 'images')}),
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
]

