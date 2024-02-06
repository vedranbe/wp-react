import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from "moment";
import "./styles.css"; // Make sure to import your CSS file for styles.

const baseTitle = "GTIS";
const baseUrl = "https://gtis.co.za";
const baseLogo = baseUrl + "/wp-content/themes/gtis/img/logo.png";
const baseCat = "4";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [nrofpages, setNumberofpage] = useState(1);
  const [loading, setLoading] = useState(true); // Added loading state
  var imageUrl = null;

  useEffect(() => {
    Axios.get(
      baseUrl + "/wp-json/wp/v2/posts?_embed&per_page=5&categories=" + baseCat,
      {
        params: { page: page },
      }
    )
      .then((response) => {
        setNumberofpage(response.headers["x-wp-totalpages"]);
        setPosts(response.data);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after data is fetched
      });
  }, [page, setPosts]);

  const smoothScrollToTop = () => {
    const duration = 500; // Adjust the duration of the scroll animation
    const element = document.documentElement;
    const start = element.scrollTop;
    const startTime = performance.now();

    const scrollStep = (timestamp) => {
      const currentTime = timestamp - startTime;

      if (currentTime < duration) {
        const ease = easeInOutQuad(currentTime, 0, 1, duration);
        element.scrollTop = Math.floor(ease * (0 - start)) + start;
        requestAnimationFrame(scrollStep);
      } else {
        element.scrollTop = 0;
      }
    };

    requestAnimationFrame(scrollStep);
  };

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const showPrevPage = () => {
    setPage(page - 1 ? page - 1 : 1);
    smoothScrollToTop();
  };

  const showNextPage = () => {
    setPage(page < nrofpages ? page + 1 : nrofpages);
    smoothScrollToTop();
  };

  return (
    <div className="posts-wrapper">
      <img src={baseLogo} alt={baseTitle} />
      {loading ? ( // Display "Loading..." while loading is true
        <p>Loading...</p>
      ) : (
        <div className="fade-container">
          {posts &&
            posts.length &&
            posts.map((post, index) => {
              if (post._embedded["wp:featuredmedia"]) {
                imageUrl =
                  post._embedded["wp:featuredmedia"][0].media_details.sizes.full
                    .source_url;
                return (
                  <div
                    key={post.id}
                    className={`posts-post fade-in-post`}
                    style={{
                      animationDelay: `${index * 0.2}s`, // Adjust the delay for each post
                    }}
                  >
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h2
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      ></h2>
                      <span className="date">
                        {moment(post.date).format("DD.MM.YYYY")}
                      </span>
                      <figure>
                        <img
                          alt={post.title.rendered}
                          src={imageUrl}
                        />
                      </figure>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt.rendered,
                        }}
                      ></p>
                    </a>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      )}
      {!loading && ( // Show navigation buttons only when loading is false
        <div className="posts-post-nav">
          <button className="prev" onClick={showPrevPage}>&#60;</button>
          <p>
            Page {page} of {nrofpages}
          </p>
          <button className="next" onClick={showNextPage}>&#62;</button>
        </div>
      )}
    </div>
  );
}
