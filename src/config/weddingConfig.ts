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
    // NEW: Dress Code & FAQs
    dressCode: {
        description: string;
        colors: { name: string; hex: string }[];
    };
    faqs: { question: string; answer: string }[];
}

export const siteConfig: WeddingConfig = {
    coupleNames: "Faith & Chris",
    weddingDate: "2026-07-12T14:00:00",
    venue: {
        name: "Atlanta, Georgia",
        mapLink: "https://maps.app.goo.gl/5Aye5qqZUjvEjAZE7",
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
        message: "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a cash gift, you can use the details below.",
    },
    gallery: {
        images: [
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
        ],
        guestAlbumLink: "https://photos.google.com/share/your-album-link-here",
    },
    content: {
        story: "It all started with a simple hello...",
        schedule: [
            { time: "09:00 AM", event: "Arrival & Seating" },
            { time: "10:00 AM", event: "The Vows", description: "Main ceremony begins." },
            { time: "01:00 PM", event: "Reception", description: "Food, drinks, and dancing!" },
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
    // Dress Code & FAQs Data
    dressCode: {
        description: "We kindly request our guests to dress in formal evening wear. Please adhere to our wedding color palette below.",
        colors: [
            { name: "Burgundy", hex: "#780606" },
            { name: "Champagne", hex: "#F2E8C6" },
            { name: "Charcoal", hex: "#36454F" }
        ]
    },
    faqs: [
        { question: "Can I bring a plus one?", answer: "Due to venue capacity, we can only accommodate guests formally specified on your RSVP." },
        { question: "Is there parking available?", answer: "Yes, complimentary valet parking is available at the main entrance of the venue." },]
};