export default function AboutPage() {
  return (
    <div className="about-container">
      <h1>About MintAI</h1>
      <p className="tagline">Your AI-powered health & beauty assistant</p>

      <div className="vision-mission">
        <div className="vision">
          <h2>🌟 Our Vision</h2>
          <p>Har Indian ko affordable, accessible, aur AI-powered health & beauty guidance dena. Ek sehatmand aur khubsurat Bharat ka nirmaan, jahan har vyakti ko uski bhasha mein sahi salah mile.</p>
        </div>
        <div className="mission">
          <h2>🎯 Our Mission</h2>
          <p>MintAI AI aur natural remedies ke dwara logon ko unke skin, hair aur health issues ke liye turant, behtar aur practical solutions pradaan karta hai. Hum affiliate products aur blogs ke through trusted information spread karte hain.</p>
        </div>
      </div>

      <div className="story">
        <h2>📖 Our Story</h2>
        <p>Shuruaat ek simple idea se hui – jab mere grandfather ko health tips chahiye the aur unhe koi turant jawab nahi mil paata tha. Tab maine socha, kyun na AI ki madad se ek aisa chatbot banaya jaye jo har kisi ki bhasha (Hinglish) mein sehat aur beauty ke sawaalon ke jawab de. Isi soch ne MintAI ko janam diya. Aaj ye website free mein logon ki madad kar rahi hai, aur aage hum aur bhi features lekar aa rahe hain.</p>
      </div>

      <style jsx>{`
        .about-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        h1 {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .tagline {
          text-align: center;
          color: #2e9e4f;
          margin-bottom: 2rem;
        }
        .vision-mission {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .vision, .mission {
          flex: 1;
          background: rgba(255,255,255,0.6);
          padding: 1.5rem;
          border-radius: 24px;
          backdrop-filter: blur(4px);
        }
        h2 {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
        }
        .story {
          background: rgba(255,255,255,0.6);
          padding: 1.5rem;
          border-radius: 24px;
          backdrop-filter: blur(4px);
        }
        @media (max-width: 700px) {
          .vision-mission {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}