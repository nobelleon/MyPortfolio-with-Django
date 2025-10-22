from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    context = {
        'title' : 'my portfolio',
        'developer' : 'Nobelleon M',
    }
    return render(request, 'index.html', context)
   

def welcome_view(request):
    welcome_view = loader.get_template('temp_portfolio/pages/welcome.html')
    return  HttpResponse(welcome_view.render())
    
def about_view(request):    
    context = {
        'about' : 'about me',
        'description' : 'I am a mobile app developer based in South Tangerang, Indonesia.I have a S.kom of computer science from the University of Pembangunan Nasional (Veteran), Jakarta.I am currently activity is creating a personal mobile application project, improving modifying mobile apps and develop mobile apps.'
    }
    return render(request, "temp_portfolio/pages/about.html", context)   
   
            
def my_youtube_view(request):
    my_youtube_view = loader.get_template('temp_portfolio/pages/my_youtube.html')
    return  HttpResponse(my_youtube_view.render())
       
    
def portfolio_view(request):
    portfolio_view = loader.get_template('temp_portfolio/pages/portfolio.html')
    return  HttpResponse(portfolio_view.render())
       
    
def contact_view(request):
    contact_view = loader.get_template('temp_portfolio/pages/contact.html')
    return  HttpResponse(contact_view.render())

def experience_view(request):
    experience_view = loader.get_template('temp_portfolio/pages/experience.html')
    return HttpResponse(experience_view.render())

def location_view(request):
    location_view = loader.get_template('temp_portfolio/pages/location.html')
    return HttpResponse(location_view.render())

def social_media_view(request):
    social_media_view = loader.get_template('temp_portfolio/pages/social_media.html')
    return HttpResponse(social_media_view.render())
        
def resume_view(request):
    resume_view = loader.get_template('temp_portfolio/pages/resume.html')
    return HttpResponse(resume_view.render())

def skill_view(request):
    skill_view = loader.get_template('temp_portfolio/pages/skill.html')
    return HttpResponse(skill_view.render())

def project_view(request):
    project_view = loader.get_template('temp_portfolio/pages/project.html')
    return HttpResponse(project_view.render())

def licensing_and_certification_view(request):
    licensing_and_certification_view = loader.get_template('temp_portfolio/pages/licensing_and_certification.html')
    return HttpResponse(licensing_and_certification_view.render())

def art_webster_view(request):
    art_webster_view = loader.get_template('temp_portfolio/pages/art_webster.html')
    return HttpResponse(art_webster_view.render())

def time_view(request):
    time_view = loader.get_template('temp_portfolio/pages/time.html')
    return HttpResponse(time_view.render())

def sunset_view(request):
    sunset_view = loader.get_template('temp_portfolio/pages/sunset.html')
    return HttpResponse(sunset_view.render())

def city_view(request):
    city_view = loader.get_template('temp_portfolio/pages/city_views_on_top.html')
    return HttpResponse(city_view.render())

def aerial_view(request):
    aerial_view = loader.get_template('temp_portfolio/pages/aerial.html')
    return HttpResponse(aerial_view.render())

def calendar_view(request):
    calendar_view = loader.get_template('temp_portfolio/pages/calendar.html')
    return HttpResponse(calendar_view.render())