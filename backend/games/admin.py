from django.contrib import admin
from .models import Game, Favorite

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'genre', 'slug')
    search_fields = ('title', 'genre')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'created_at')
    list_filter = ('user', 'game')
