from rest_framework import viewsets, permissions
from .models import CartItem
from .serializers import CartItemSerializer

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        game = serializer.validated_data['game']
        cart_item = CartItem.objects.filter(user=self.request.user, game=game).first()
        if cart_item:
            cart_item.quantity += serializer.validated_data.get('quantity', 1)
            cart_item.save()
        else:
            serializer.save(user=self.request.user)
