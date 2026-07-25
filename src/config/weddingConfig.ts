export interface WeddingConfig {
    coupleNames: string;
    weddingDate: string;
    venues: {
        church: {
            name: string;
            mapLink: string;
        };
        reception: {
            name: string;
            mapLink: string;
        };
    };
    theme: {
        primaryColor: string;
        secondaryColor: string;
        mode: 'light' | 'dark';
    };
    entrance: {
        type: 'envelope' | 'curtains';
    };
    features: {
        scratchToReveal: boolean;
        backgroundMusic: boolean;
        musicSrc?: string;
        liveGuestbook: boolean;
        backgroundType: 'image' | 'canvas' | 'video';
        bgAsset?: string;
    };
    // explicitly supports both a Till and a Phone Number
    mpesa: {
        enabled: boolean;
        tillNumber: string;
        phoneNumber: string;
        accountName: string;
        message: string;
    };
    gallery: {
        images: string[];
        guestAlbumLink: string;
    };
    content: {
        story: string;
        schedule: { time: string; event: string; description?: string }[];
        bridalTeam: { name: string; role: string; photo?: string }[];
    };
    dressCode: {
        description: string;
        colors: { name: string; hex: string }[];
    };
    faqs: { question: string; answer: string }[];
}

export const siteConfig: WeddingConfig = {
    coupleNames: "Faith & Chris",
    weddingDate: "2026-08-01T09:00:00",

    venues: {
        church: {
            name: "Chrisco Church, The Joyful Assembly, Thika",
            mapLink: "https://maps.app.goo.gl/WVfVzjvsnxpS6cFt8",
        },
        reception: {
            name: "KALRO-HRI, Kandara",
            mapLink: "https://maps.app.goo.gl/F4Y4qy3mav3GD5op8",
        }
    },

    theme: {
        primaryColor: "#780606",
        secondaryColor: "#F5F5F5",
        mode: "light",
    },
    entrance: {
        type: "curtains",
    },
    features: {
        scratchToReveal: true,
        backgroundMusic: true,
        musicSrc: "/audio/wema.mp3",
        liveGuestbook: true,
        backgroundType: "image",
        bgAsset: "images/background.jpg",
    },

    // holds both payment options
    mpesa: {
        enabled: true,
        tillNumber: "6802677",
        phoneNumber: "0713795315",
        accountName: "Chris Mugo",
        message: "We look forward to your presence as we start a new chapter in our life. If you purpose to gift us, you are welcome. You can use the details below.",
    },

    gallery: {
        images: [
            "/images/gallery/pic1.jpg",
            "/images/gallery/pic2.jpg",
            "/images/gallery/pic3.jpg",
            "/images/gallery/pic4.png",
            "/images/gallery/pic5.png",
            "/images/gallery/pic6.png",
            "/images/gallery/pic7.png",
            "/images/gallery/pic8.png",
        ],
        guestAlbumLink: "https://photos.app.goo.gl/pCriZfDw5hj189V89",
    },
    content: {
        story: "It all started with a simple hello...",

        schedule: [
            {
                time: "10:00 AM",
                event: "Church Service",
                description: "Join us as we exchange our vows at Chrisco Church The Joyful Assembly."
            },
            {
                time: "01:00 PM",
                event: "Reception",
                description: "Let's celebrate! Join us for food, drinks, and dancing at KALRO, HRI Thika."
            },
        ],

        bridalTeam: [],
    },
    dressCode: {
        description: "We kindly request our guests to dress in elegant wear. Here is our theme color palette.",
        colors: [
            { name: "Sage Green", hex: "#9eb3a0" },
            { name: "Espresso", hex: "#4d3c2a" },
            { name: "Taupe", hex: "#b2a38d" },
            { name: "Terracotta", hex: "#c57e6b" },
            { name: "Slate", hex: "#4f676b" },
            { name: "Ochre", hex: "#e8b868" }
        ]
    },
    faqs: [
        { question: "Is there parking available?", answer: "Yes, parking is available at the main entrance of both venues." },
        { question: "Any gift preferences?", answer: "We look forward to your presence as we start a new chapter in our life. If you purpose to gift us, you are welcome, preferably in monetary form." }
    ]
};