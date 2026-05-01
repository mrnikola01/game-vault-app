import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from games.models import Game

games_data = [
    {
        "title": "Elden Ring",
        "price": 59.99,
        "image_url": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/page_bg_raw.jpg?t=1767883716",
        "genre": "RPG",
        "description": "An action RPG set in the Lands Between, featuring vast open world exploration.",
        "slug": "elden-ring"
    },
    {
        "title": "God of War Ragnarok",
        "price": 49.99,
        "image_url": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/wm/2025/03/god-of-war-ragnarok-kratos-dark-odyssey-skin-2.jpg?w=1600&h=900&fit=crop",
        "genre": "Action",
        "description": "Kratos and Atreus must journey to each of the Nine Realms.",
        "slug": "god-of-war-ragnarok"
    },
    {
        "title": "Cyberpunk 2077",
        "price": 39.99,
        "image_url": "https://www.cyberpunk.net/build/images/home12/cover-1920-bd460362.jpg",
        "genre": "RPG",
        "description": "An open-world action adventure set in Night City.",
        "slug": "cyberpunk-2077"
    },
    {
        "title": "Hogwarts Legacy",
        "price": 44.99,
        "image_url": "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/store/software/switch/70010000014724/72ce0a17215521a167c3da579db4cc48a2f7a52eacc81ad985ba20fd6817fdc2",
        "genre": "RPG",
        "description": "Explore Hogwarts in the 1800s in this open world RPG.",
        "slug": "hogwarts-legacy"
    },
    {
        "title": "Red Dead Redemption 2",
        "price": 29.99,
        "image_url": "https://static0.srcdn.com/wordpress/wp-content/uploads/2018/10/Red-Dead-Redemption-2-Key-Art-Cropped.jpg?q=50&fit=crop&w=1440&h=990&dpr=1.5",
        "genre": "Action",
        "description": "An epic tale of life in Americas unforgiving heartland.",
        "slug": "red-dead-redemption-2"
    },
    {
        "title": "The Witcher 3",
        "price": 19.99,
        "image_url": "https://sm.ign.com/t/ign_za/articlepage/w/we-played-/we-played-the-witcher-3-wild-hunt-for-6-hours-ign_d32k.1280.jpg",
        "genre": "RPG",
        "description": "Play as Geralt of Rivia in this vast open world RPG.",
        "slug": "the-witcher-3"
    }
]

# Prvo brišemo postojeće da ne bi bilo duplikata ako ih ponovo pokreneš
Game.objects.all().delete()

for game in games_data:
    Game.objects.create(
        title=game['title'],
        price=game['price'],
        image_url=game['image_url'],
        genre=game['genre'],
        description=game['description'],
        slug=game['slug']
    )

print(f"Successfully added {len(games_data)} games from mock data!")
