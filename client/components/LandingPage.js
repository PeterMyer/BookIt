import React from 'react';
import { Link } from 'react-router-dom';
import bgShowcaseImage1 from '../../public/assets/bg-showcase-1.jpg';
import bgShowcaseImage2 from '../../public/assets/bg-showcase-2.jpg';
import bgShowcaseImage3 from '../../public/assets/bg-showcase-3.jpg';

export function LandingPage() {
  return (
    <div>
      <header className="masthead">
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-xl-6">
              <div className="text-center text-white">
                {/* Page heading */}
                <h1 className="mb-5">
                  Manage your articles like never before!
                </h1>
                <div
                  className="mb-5"
                  style={{
                    fontSize: '1.2rem',
                  }}
                >
                  <div>
                    Tired of scrolling through dozens of saved articles to find
                    the rght one?
                  </div>
                  <div>Have no idea why this article was saved?</div>
                  <div>
                    Want to share a bunch of articles and have to copy them
                    one-by-one?{' '}
                  </div>
                </div>
                <h1>Try BookIt!</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Icons Grid--> */}
      <section className="features-icons bg-light text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                <div className="features-icons-icon d-flex">
                  <i
                    className="bi bi-tags m-auto text-primary"
                    style={{ color: '#ec104d' }}
                  ></i>
                </div>
                <h3>Add tags and notes to articles</h3>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                <div className="features-icons-icon d-flex">
                  <i className="bi bi-share m-auto text-primary"></i>
                </div>
                <h3>Share article lists with one link</h3>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                <div className="features-icons-icon d-flex">
                  <i className="bi bi-card-checklist m-auto text-primary"></i>
                </div>
                <h3>Monitor your reading habits</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
