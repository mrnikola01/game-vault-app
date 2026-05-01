from rest_framework import serializers
from .models import CartItem
from games.serializers import GameSerializer

class CartItemSerializer(serializers.ModelSerializer):
    game_details = GameSerializer(source='game', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'game', 'game_details', 'quantity', 'created_at']
        read_only_fields = ['user', 'created_at']
