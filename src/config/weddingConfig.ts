export interface WeddingConfig {
    coupleNames: string;
    weddingDate: string;
    venue: {
        name: string;
        mapLink: string;
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
    mpesa: {
        enabled: boolean;
        type: 'till' | 'paybill' | 'send_money';
        number: string;
        accountName?: string;
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
    venue: {
        name: "KALRO, Thika",
        mapLink: "https://maps.app.goo.gl/F4Y4qy3mav3GD5op8",
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
        musicSrc: "/audio/wedding-march.mp3",
        liveGuestbook: true,
        backgroundType: "image",
        bgAsset: "images/background.jpg",
    },
    mpesa: {
        enabled: true,
        type: "till",
        number: "123456",
        accountName: "Faith Weds Chris",
        message: "We look forward to your presence as we start a new chapter in our life. If you purpose to gift us, you are welcome. You can use the details below.",
    },
    gallery: {
        images: [
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
        ],
        guestAlbumLink: "#",
    },
    content: {
        story: "It all started with a simple hello...",
        schedule: [
            { time: "09:00 AM", event: "Arrival & Seating" },
            { time: "10:00 AM", event: "The Vows", description: "Main ceremony begins." },
            { time: "01:00 PM", event: "Reception", description: "Food, drinks, and dancing!" },
            { time: "03:00 PM", event: "Gifts and speeches" },
            { time: "04:30 PM", event: "Cake Cutting" },


        ],
        bridalTeam: [
            { name: "Michael Scott", role: "Best Man" },
            { name: "Pam Beesly", role: "Maid of Honor" },
            { name: "Jim Halpert", role: "Groomsman" },
            { name: "Angela Martin", role: "Bridesmaid" },
            { name: "Dwight Schrute", role: "Groomsman" },
            { name: "Kelly Kapoor", role: "Bridesmaid" },
        ],
    },
    // Dress Code & FAQs
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
        { question: "Can I bring a plus one?", answer: "Due to venue capacity, we can only accommodate guests formally specified on your RSVP." },
        { question: "Is there parking available?", answer: "Yes, parking is available at the main entrance of the venue." },
        { question: "Any gift preferences?", answer: "We look forward to your presence as we start a new chapter in our life. If you purpose to gift us, you are welcome, preferably in monetary form." },]
};