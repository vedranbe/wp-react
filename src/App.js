/*
 * Import remote dependancies
 */
import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from "moment";

// WORDPRESS SITE.
const baseTitle = "GTIS";
const baseUrl = "https://gtis.co.za";
const baseLogo = baseUrl + "/wp-content/themes/gtis/img/logo.png";
const baseCat = "4";

export default function App() {
  // Track state for posts, current page and number of pages
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [nrofpages, setNumberofpage] = useState(1);
  var imageUrl = null;

  // When the page number changes call the api for posts.
  useEffect(() => {
    Axios.get(
      baseUrl + "/wp-json/wp/v2/posts?_embed&per_page=5&categories=" + baseCat,
      {
        params: { page: page },
      }
    ).then((response) => {
      // Store the number of posible pages.
      setNumberofpage(response.headers["x-wp-totalpages"]);
      // Store the posts from the response.
      setPosts(response.data);
    });
  }, [page, setPosts]);

  // Event handler: Decrease page count no lower then 1.
  const showPrevPage = () => setPage(page - 1 ? page - 1 : 1);
  // Event handler: Increase page count no higher then nrofpages.
  const showNextPage = () => setPage(page < nrofpages ? page + 1 : nrofpages);

  return (
    <div className="posts-wrapper">
      <img src={baseLogo} alt={baseTitle} />
      {posts &&
        posts.length &&
        posts.map((post, index) => {
          if (post._embedded["wp:featuredmedia"]) {
            imageUrl =
              post._embedded["wp:featuredmedia"][0].media_details.sizes.full
                .source_url;
            return (
              <div key={post.id} className="posts-post">
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  <h2
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  ></h2>

                  <span className="date">
                    {moment(post.date).format("DD.MM.YYYY")}
                  </span>
                  <figure>
                    <img alt={post.title.rendered} src={imageUrl} />
                  </figure>
                  <p
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  ></p>
                </a>
              </div>
            );
          } else {
            return null;
          }
        })}
      <div className="posts-post-nav">
        <button onClick={showPrevPage}>&#60;</button>
        <p>
          Page {page} of {nrofpages}
        </p>
        <button onClick={showNextPage}>&#62;</button>
      </div>
    </div>
  );
}
