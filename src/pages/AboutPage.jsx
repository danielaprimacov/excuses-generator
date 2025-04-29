export default function AboutPage() {
  return (
    <div className="about-container">
      <h1 className="about-title">About us</h1>

      {/* ABOUT THE PROJECT */}

      <section className="about-section">
        <div className="about-text">
          <h2 className="about-heading">Why Nopify</h2>

          <p className="about-paragraph">
            Sometimes you just don’t want to do the thing — and that’s okay. 
            But saying “no” can feel impossible, especially when you're a people-pleaser or a chronic “yes” person. That’s where we come in.
          </p>

          <p className="about-paragraph">
            Our solution helps you *exit gracefully* from obligations you regret agreeing to. 
            Whether you need an excuse that’s funny, realistic, unforgettable, or just barely believable, we’ve got your back.
          </p>

          <p className="about-paragraph">
          You’ll also be able to keep a private log of your past excuses (no judgment here), 
          and if things spiral — we offer a consulting service to help you strategically come clean.
          </p>
        </div>
        

        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1552912276-dde406237918?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2F5JTIwbm98ZW58MHx8MHx8fDA%3D" 
            alt="Saying-no" 
            className="about-image"
          />
        </div>
        
      </section>

      {/* ABOUT THE TEAM */}

      <section className="about-section">
        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="two-women" 
            className="about-image"
          />
        </div>

        <div className="about-text">
          <h2 className="about-heading">Who We Are</h2>

          <ul className="about-list">
            <li className="about-list-item">
              <strong>Diep</strong> – The product brain and excuse strategist. Believes in soft skills, strong boundaries, and semi-honest communication.
              <div className="about-links">
                <a href="https://www.linkedin.com/in/ziepenguyen/" target="_blank" rel="noopener noreferrer">LinkedIn</a> 
                <a href="https://github.com/znguye" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </li>

            <li className="about-list-item">
              <strong>Daniela</strong> – The engineering muscle and creative debugger. Can build a frontend, backend, or your exit strategy.
              <div className="about-links">
                <a href="https://www.linkedin.com/in/daniela-primacov-523778242/" target="_blank" rel="noopener noreferrer">LinkedIn</a> 
                <a href="https://github.com/danielaprimacov" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </li>
          </ul>
        </div>
        
      </section>
        
      {/* COMMITMENT TO SOCIETY */}

      <section className="about-section">
        <div className="about-text">
          <h2 className="about-heading">Our Commitment</h2>

          <p className ="about-paragraph">
            We think tech should be for everyone — not just those who fit a certain mold. 
            And we believe apps don’t always have to be serious. Sometimes, they can just help you out of something you never wanted to do in the first place.
          </p>

          <p className ="about-paragraph">
            We also believe that learning to say “no” is a life skill — especially for women, who are often expected to be agreeable before anything else. 
            Saying no isn’t rude; it’s smart.
          </p>

          <p className="about-paragraph">
            Our goal is to help everyone — women, men, and everyone outside or in between — become more intentional with their time and energy. 
            Sometimes the most powerful thing you can do is say “no” to the wrong things, so you can say “yes” to what really matters.
          </p>          
        </div>

        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8OHx8ZnJlZWRvbXxlbnwwfHwwfHx8MA%3D%3D" 
            alt="social-commitment" 
            className="about-image"
          />
        </div>
      

      </section>

      {/* Closing */}
      <p className="about-closing">
        Thanks for visiting. We hope our app helps you say “no” with style — or at least helps you avoid your group project one more day.
      </p>
        
    </div>
    );
}
