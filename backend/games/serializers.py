from rest_framework import serializers
from .models import Game, Favorite

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    game_details = GameSerializer(source='game', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'game', 'game_details', 'created_at']
        read_only_fields = ['user', 'created_at']
