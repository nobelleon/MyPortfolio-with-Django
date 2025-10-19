from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('welcome/', views.welcome_view, name='welcome'),
    path('about/', views.about_view, name='about'),
    path('my_youtube/', views.my_youtube_view, name='my_youtube'),
    path('portfolio/', views.portfolio_view, name='portfolio'),
    path('contact/', views.contact_view, name='contact'),
    path('experience/',views.experience_view, name='experience'),
    path('location/', views.location_view, name='location'),
    path('social_media/',views.social_media_view, name='social_media'),
    path('resume/', views.resume_view, name='resume'),
    path('skill/', views.skill_view, name='skill'),
    path('project/', views.project_view, name='project'),
    path('licensing_and_certification/', views.licensing_and_certification_view, name='licensing_and_certification'),
    path('time/', views.time_view, name='time'),
    path('art_webster/', views.art_webster_view, name='art_webster'),
    path('sunset/', views.sunset_view, name='sunset'),
    path('city_views_on_top/', views.city_view, name='city_view'),
    path('aerial/', views.aerial_view, name='aerial')
]
