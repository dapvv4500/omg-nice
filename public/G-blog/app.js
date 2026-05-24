//  Key for localStorage
const STORAGE_KEY = "my_blog_posts_v1";
const AUTH_KEY = "my_blog_admin_pin";
const DARK_KEY = "my_blog_dark_mode";

// -----------------------------
// INITIAL DATA
// -----------------------------
function getPosts() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if ( !raw || raw.length<10 ) {
      const sample = [
        {
          id: Date.now(),
          title: "Title: Welcome to My Blog",
          excerpt: "Excerpt: This is your first post.",
          content: `<p>Content: You are able to do some tasks from the <hig>"Admin page"</hig> like.<br>
            1- <hig>Edit</hig>, hightlight text contents or.<br>
            2- <hig>Delete</hig>, remove single post or.<br>
            3- <hig>Search post</hig> by Title or by Category.<br>
            4- <hig>Reading</hig>, Speak text contents of your Post.<br>
            5- Do <hig>"Backup"</hig> posts, <hig>Restore</hig> Posts from .json file.<br>
            6- Use <hig>"Sample Posts"</hig>, (Choose <hig>eng /vn</hig> language) for samples learning.<br>
          This Blog workes as Notes, Notebook, where you want to write down your remarkble idea from your learning path;<br>
          even though Cooking recipe, Shopping list, Finacial invest stock, programing idea,,,.
          all the <hig>posts' data</hig> were stored on <hig>your own devices</hig> so they are your private.</p>`,
          category: "Category: General",
          createdAt: new Date().toISOString()
        }
      ];
      console.log(0.111111, "Empty Post, Created sample : " + sample.title );
      savePosts(sample);
      raw = localStorage.getItem(STORAGE_KEY);
    }
    try {
      const items = JSON.parse(raw);
      console.log(0.1, STORAGE_KEY + ' -> getPosts = ' + items.length + ' posted.');
      return items;

    } catch (err) {
      return ["Empty post or Something ERROR : " + err.message];
    }
  } 

// -----------------------------
// SAVE POSTs
// -----------------------------
function savePosts(posts) {
  console.log('New post was Saved .."' +  STORAGE_KEY + '" (admin)');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// -----------------------------
// DARK MODE
// -----------------------------
function initDarkMode() {
  const saved = localStorage.getItem(DARK_KEY);
  if (saved === "dark") document.body.classList.add("dark");

  const btn = document.getElementById("dark-toggle");
  if (btn) {
    btn.onclick = () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(DARK_KEY, document.body.classList.contains("dark") ? "dark" : "light");
    };
  }
}

// -----------------------------
// SEARCH + CATEGORY FILTER
// -----------------------------
function renderPostsList() {
  const posts = getPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const container = document.getElementById("posts-list"); //Home
  if (!container || posts.length == 0) return;

  const search = document.getElementById("search-input")?.value.toLowerCase() || "";
  const category = document.getElementById("category-filter")?.value || "";
  // Search by title - home
  const filtered = posts.filter(p =>
    (p.title.toLowerCase().includes(search) || p.excerpt.toLowerCase().includes(search)) &&
    (category === "" || p.category === category)
  );
  // Home.html //
  container.innerHTML = filtered.map(post => `
    <article class="post-card">
      <h3 title="post title">${escapeHtml(post.title)}</h3>
      <p title="post excerpt, in short">${escapeHtml(post.excerpt)}</p>
      <small title="post category">Category: ${post.category}</small><br>
      <a class="read-more" href="/post?id=${post.id}">Read more →</a>
    </article>
  `).join("");
  //console.log(0.3, ' renderPostsList() -> "Existing posts" =', posts.length);
  const search_box = document.getElementById("search-input");
  if (search_box.value === "") {
    populateCategoryFilter(posts);
    console.log(0.333, 'Call populateCategoryFilter() -> Length =', posts.length);
  };
}

function populateCategoryFilter(posts) {
  // home
  const select = document.getElementById("category-filter");
  if (select) {
    const categories = [...new Set(posts.map(p => p.category))];
    select.innerHTML = `<option value="">All categories</option>` +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");
    return;
  }
  // admin 
  const select2 = document.getElementById("post-category");
  if (!select2) return;

  const categories2 = [...new Set(posts.map(p => p.category))];
  select2.innerHTML = `<option value=""></option>` +
    categories2.map(c => `<option value="${c}">${c}</option>`).join("");

    if (select2.value ==="") { select2.value = "General" }
    console.log('(admin) -> Get "' + select2.id + '".value = ' + select2.value);
}

// -----------------------------
// SEARCH + CATEGORY FILTER
// -----------------------------
function getAllPosts() {
  const posts = getPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const container = document.getElementById("posts");
  if (!container) return;
  // Posts.html //
  container.innerHTML = "";
  container.innerHTML = `<h3 title="Dapvv4500 - V05.05.2026"> All Posts: ${posts.length}
    </h3>` + posts.map( post => `
    <article class="post-card">
      <b title="post title">${escapeHtml(post.title)}</b>
      <p title="post excerpt, in short">${escapeHtml(post.excerpt)}</p>
      <small title="post category"> Category: ${post.category}</small><br>
      <a class="read-more" href="/post?id=${post.id}">Read more →</a>
      <hr>
    </article>
  `).join("");
  
  console.log(0.33, 'getAllPosts() => Posts =', posts.length);
  //populateCategoryFilter(posts);
}

// -----------------------------
// SINGLE POST / read more -> //
// -----------------------------
function renderSinglePost() {
  const id = new URLSearchParams(location.search).get("id");
  const path = window.location.pathname;
  
  var post = getPosts().find(p => String(p.id) === id);
  const container = document.getElementById("posts");
  console.log(0.2, 'renderSinglePost() -> click Read more ->' + path + '?id='+id);
  // if not found
  if (!post) {
    container.innerHTML = `<p>Not any found.</p>  
      <button class="btn-small btn-danger posts-btn" onclick=getAllPosts() 
        title="Click me to get more Posts."> Click for more Post. 
      </button>`;
    return;
  }
  // display post
  container.innerHTML = `<p title="post id:"><did>${post.id}</did></p>
    <div class="meta"    title="Post date:" > <did>${new Date(post.createdAt).toLocaleString()} </did></div>
    <h3  style="color:aaa111" title="Title"> ${escapeHtml(post.title)}</h3>
    <div class="content" title="In-short"> <u style="color:green"> Excerpt:</u> <br> ${post.excerpt}       </div> <br>
    <div class="content" title="Click to speak"  > <u style="color:blue"> Content:</u>   </div> 
    <span id="play-button" title="Click to speak">▶️</span>...
    <span id="play-lang" title="Select Language = Stop Reading.">en-US</span>
    <div class="content" title="Post content"   id="play-content"> ${post.content}                           </div> <br>
    <div class="content" title="Category"> <u style="color:gray"> Category:</u><br> ${post.category}       </div> <br>
  `;
  const play = document.getElementById("play-tag");
  play.innerHTML='..';
}

// -----------------------------
// SIMPLE ADMIN AUTH (PIN)
// -----------------------------
function requireAdminAuth() {
  let pin = localStorage.getItem(AUTH_KEY);
  if (!pin) {
    pin = prompt("Set admin PIN:");
    if (!pin) return location.href = "/blog";
    localStorage.setItem(AUTH_KEY, pin);
  }
  const entered = prompt("Enter admin PIN:");
  if (entered !== pin) {
    alert("Wrong PIN");
    location.href = "/blog";
  }
  if (pin) {document.getElementById("adminpin").innerText = pin};
}

// -----------------------------
// ADMIN PAGE
// -----------------------------
function initAdminPage() {
  //requireAdminAuth();
  const form = document.getElementById("post-form");
  const list = document.getElementById("admin-posts-list");
  
  function refresh() {
    console.log(0.4, ' "initAdminPage" -> refresh Existing posts (admin.html)');
    const posts = getPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    populateCategoryFilter(posts);

    list.innerHTML = posts.map(p => `
      <div class="admin-post-row" data-id="${p.id}">
        <div class="title">${escapeHtml(p.title)} (${p.category})</div>
        <div>
          <button class="btn-small btn-secondary edit-btn">Edit</button>
          <button class="btn-small btn-danger delete-btn">Delete</button>
        </div>
      </div>
    `).join("");
  }

  form.onsubmit = e => {
    e.preventDefault();
    const id = document.getElementById("post-id").value;
    const title = document.getElementById("post-title").value;
    const excerpt = document.getElementById("post-excerpt").value;
    const content = addBrHtml(document.getElementById("post-content").value);
    var category = document.getElementById("post-category").value;
    if (!category) {category='General'};

    let posts = getPosts();

    if (id) {
      posts = posts.map(p => p.id == id ? { ...p, title, excerpt, content, category } : p);
    } else {
      posts.push({
        id: Date.now(),
        title,
        excerpt,
        content,
        category,
        createdAt: new Date().toISOString()
      });
    }
    console.log(title + '  is Saved in localStorage...(admin)');
    savePosts(posts);
    form.reset();
    refresh();
  };

  list.onclick = e => {
    const row = e.target.closest(".admin-post-row");
    if (!row) return;
    const id = row.dataset.id;
    let posts = getPosts();
    const post = posts.find(p => p.id == id);

    if (e.target.classList.contains("edit-btn")) {
      console.log(0.5 + '  edit the post :' + post.title + '...(admin)');
      document.getElementById("post-id").value = post.id;
      document.getElementById("post-title").value = post.title;
      document.getElementById("post-excerpt").value = post.excerpt;
      document.getElementById("post-content").value = post.content;
      document.getElementById("post-category").value = post.category;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (e.target.classList.contains("delete-btn")) {
      console.warn(0.6, '  Delete a post :' + post.title + '...(admin)');
      if (confirm("Delete this post?")) {
        posts = posts.filter(p => p.id != id);
        savePosts(posts);
        refresh();
      }
    }
  };

  refresh();
}

// -----------------------------
// HELPERS
// -----------------------------
function escapeHtml(str) {
  return str.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function addBrHtml(str) {
  const html = str.replace(/<br>/g, "");
  return html.replace(/[.]/g, ".<br>");
  //console.log(0.222222222222,'/<br\s*\/?>/g, ""');
}

// -----------------------------
// INIT
// -----------------------------
window.onload = () => {
  initDarkMode();
};

// -----------------------------
// SEARCH by CATEGORY 
// -----------------------------
function searchByCat() {
  const posts = getPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const container = document.getElementById("posts-list"); //Home
  if (!container) return;

  const search = document.getElementById("search-input")?.value.toLowerCase() || "";
  const category = document.getElementById("category-filter")?.value || "";
  // filter - home
  const filtered = posts.filter(p =>
    (p.category.toLowerCase().includes(search) || p.excerpt.toLowerCase().includes(search)) &&
    (category === "" || p.category === category)
  );

  container.innerHTML = filtered.map(post => `
    <article class="post-card">
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.excerpt)}</p>
      <small>Category: ${post.category}</small><br>
      <a class="read-more" href="/post?id=${post.id}">Read more →</a>
    </article>
  `).join("");
  
/* updated: 05.05.2026  */
}

// -----------------------------
// BACKUP LOCAL STORAGE POSTS -- backupLS
// -----------------------------
function saveLocalStorage() {
  const dd = new Date();
  const ddate = dd.getDate()+'-'+dd.getMonth()+'-'+ dd.getFullYear()+'-'+dd.getHours()+'-'+dd.getMinutes();
  const fname = "Posts-Backup-(" + ddate + ").json"
  
  const data = JSON.stringify(localStorage,null,2);
  const blob = new Blob( [data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = fname;
  a.click();
  URL.revokeObjectURL(url);
  console.log('-- Backup Posts completed -- FileName = "'+ fname +'"');
  alert('-- Backup Posts completed -- FileName = "'+ fname +'"');
}

// -----------------------------
// RESTORE LOCAL STORAGE POSTS -- restoreLS
// -----------------------------
async function restoreLocalStorage(file) {
  const text = await file.text();
  const data = await JSON.parse(text);

  Object.entries(data).forEach(([key, value]) => {
    if (key==='my_blog_posts_v1')   {
      localStorage.setItem(key, value);
      console.log('** Posts Restore completed ** ' + key + ' ** Length =', value.length);
      alert('** Posts Restore completed ** '+key+'\n** Refresh the page..');
    }
  });
}

// -----------------------------
// SAMPLE POST / read more -> //
// -----------------------------
async function render_Sample_Post(langues) {
  const id = new URLSearchParams(location.search).get("id");
  const path = window.location.pathname;
  const container = document.getElementById("posts");
  var jfile = '';
  
  if (langues === 'en') {
    jfile = '../G-blog/Posts-Samples-en.json';
  } else {  // (langues === 'vn') 
    jfile = '../G-blog/Posts-Samples-vn.json';
  }

  console.log(0.301, jfile, '--path:' + path, '--id:' + id);
  let posts = await getSampleJsonfile(jfile);
  
  if (!posts || posts.mess) {
    container.innerHTML = `<p>Not any found..</p>  
    <button class="btn-small btn-danger posts-btn" onclick=getAllPosts() 
    title="Click me to get more Posts."> Click for more Post. 
    </button> <br> <p>0.302 <br> ${posts.mess}</p>
    `;
    return;
  }
  let post = posts.find( p => String(p.id) === id );
  if (!post) {
    container.innerHTML = `<p>Not any found.</p> 
      <p> Sample Posts  <b>${ jfile }?</b> id= ${id} </p>`;
    return ;
  } 
  
  // display post // Posts.html //
  console.log(0.303, '+++\n' + post.title + '\n+++', post.id);
  container.innerHTML = `<p><did>${post.id} </did></p>
      <div class="meta"    title="Post date." > <did>${new Date(post.createdAt).toLocaleString()} </did></div>
      <h3  style="color:aaa111" title="Title"> ${escapeHtml(post.title)}</h3>
      <div class="content" title="In-short"> <u style="color:red"> Excerpt:</u> <br> ${post.excerpt}       </div> <br>
      <div class="content" title="Click to speak"  > <u style="color:blue"> Content:</u>   </div> 
      <span id="play-button" title="Click to speak">▶️</span>...
      <span id="play-lang" title="Select Language = Stop Reading.">en-US</span>
      <div class="content" title="Post content"   id="play-content"> ${post.content}                           </div> <br>
      <div class="content" title="Category"> <u style="color: green"> Category:</u><br> ${post.category}       </div> <br>
    `;
    const play = document.getElementById("play-tag");  
    play.innerHTML='...';
}
    // helper funct (12-May-2026)
    async function getSampleJsonfile(jfile) {
      try {
        let response = await fetch(jfile);
        if (!response.ok) {
          throw new Error ('0.301; HTTP error! code: ' + response.status);
        }
        let data = await response.json();
        let pretty = {
          ...data,
          my_blog_posts_v1: JSON.parse(data.my_blog_posts_v1),
          clockReminders: JSON.parse(data.clockReminders),
        };
        let samplePosts = JSON.stringify(pretty.my_blog_posts_v1);
        let posts = JSON.parse(samplePosts);
        return posts;

      } catch (error) {
        let mess = {mess: `Cannot fetch file: ${jfile} / Not existing... { ` + error + ' }'}
        return mess;
        //console.error(0.301, posts);
      }
    }
