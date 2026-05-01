from rest_framework import serializers
from .models import Game, Favorite, Review

class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_email', 'game', 'is_like', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

class GameSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = '__all__'

    def get_likes_count(self, obj):
        return obj.reviews.filter(is_like=True).count()

    def get_dislikes_count(self, obj):
        return obj.reviews.filter(is_like=False).count()

class FavoriteSerializer(serializers.ModelSerializer):
    game_details = GameSerializer(source='game', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'game', 'game_details', 'created_at']
        read_only_fields = ['user', 'created_at']
