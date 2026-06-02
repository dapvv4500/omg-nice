import hello  from "../public/A-helloworld.html";
import tutap  from "../public/B-tutap/tutap4500.html";
import pwd    from "../public/C-pw-gen/pwgenertor.html";
import exp    from "../public/D-expense/expenditure.html";
import clock  from "../public/E-clock/clock102.html";
import qrpage from "../public/QR-code/F-qrcode.html";
import blog   from "../public/G-blog/index.html";
import admin  from "../public/G-blog/admin.html";
import post   from "../public/G-blog/posts.html";

import samplepost from "../public/G-blog/posts.html";
import sampleen   from "../public/G-blog/Posts-Samples-en.json";
import samplevn   from "../public/G-blog/Posts-Samples-vn.json";

/* "discribe": "index.js is worker for Cloudflare Application." */
// import QRCode from "qrcode-svg";
const QRCode = require("qrcode-svg");
// QRCode generate// TODO: Include QR code generation
async function generateQRCode(request) {  
  const { text } = await request.json();
  const qr = new QRCode({ content: text || "https://workers.dev" });
  return new Response(qr.svg(), {
    headers: { "Content-Type": "image/svg+xml" },
  });
}

var mess = "";      var resp = "";
export default {
  async fetch(request, env, ctx) { 
    const url = new URL(request.url).pathname;
    const id = new URLSearchParams(new URL(request.url).search).get("id"); 
    
    console.log(`\n<----- HelloeWorld - blog posts - v24.04.2026 ----->"
      - Update TTS - 06.05.2026
      - Update QR code - 13.05.2026
      - Update Hello page - 16.05.2026
      - Update Sample posts - 18.05.2026
      - Update format text - 24.05.2026
      - Update Exp Tracker (budgets click) - 30.05.2026
      - update Clock message display - 01.06.2026
      `);
    console.log("-- Route: url= " + url, '--?id=', id, '--method= ' + request.method);
    
    switch (url) {
      // hello world
      case "/" :
        mess = "\n1- hello world... " + url;
        resp = hello; break;
      // QRCode generate call 
      case "/qr" :
        if ( request.method === "POST") {
          mess = "6-QRCode generated; method === POST";
          return generateQRCode(request);
        } else {
          mess = "6-QRCode generator - page.";
          resp = qrpage;
        }; break;

      //tutap4500
      case "/tutap" :
        mess = "2- tutap4500...";
        resp = tutap; break;
      //password generator
      case "/pw" :
        mess = "3- pw generator...";
        resp = pwd; break;
      //expendee App
      case "/exp" :
        mess = "4- expendee app...";
        resp = exp; break;
      //clock 102
      case "/clock" :
        mess = "5- clock-102...";
        resp = clock; break;

      // blog posts - home
      case "/blog":
        mess = "7----- /blog  -----";
        resp = blog; break;
      // admin
      case "/admin":
        mess = "8----- blog - /admin -----";
        resp = admin; break;
      // posts
      case "/post":
        mess = "9----- blog - /post -----";
        resp = post; break;

      // View Sample posts - en
      case "/samples-en":
        mess = "10----- /sampleen.json - /samples -en -----";
        let lang1 = 'en';
        resp = fetchviewsample(sampleen, lang1);
        break;
      // View Sample posts - vn
      case "/samples-vn":
        mess = "11----- /samplevn.json - samples -vn -----";
        let lang2 = 'vn';
        resp = fetchviewsample(samplevn, lang2);
        break;

      // Sample posts - click Read more -> en
      case "/samplepost-en":
        if (id !== '') {
          mess = "12----ENG /samplepost-en ?id= " + id;
          resp = samplepost; 
        }; 
        break;
        
      case '/samplepost-vn':
        if(id !== '') {
          mess = "13----VN /samplepost-vn ?id= " + id;
          resp = samplepost;
          //render_Sample_Post('en'); 
        }; 
        break;

      //if not any
      default : 
        mess = '14--- Not found any ... ' + "file path = " + url + '\n';
        resp = '<h3> NOT ANY ... </h3>' + "PATH = " + url;   
    }; // switch

    try {
      console.log(mess);
      return new Response(resp, {
        headers: {"Content-Type": "text/html; charset=UTF-8",},});

    } catch (err) {
      console.log('-- Error fetch request -- ', url, err.message);
      return new Response(resp + err.message, {status: 404}, {
        headers: {"Content-Type": "text/html; charset=UTF-8",},
      });
    };
    
// helper funct (12-May-2026)
    function fetchviewsample(data, languges){
      let pretty = {
        ...data,
        my_blog_posts_v1: JSON.parse(data.my_blog_posts_v1),
        clockReminders: JSON.parse(data.clockReminders),
      };
      let postsJ = JSON.stringify(pretty.my_blog_posts_v1);
      let items = JSON.parse(postsJ);
      
      console.log( '++ Fetch() sample posts = ', items.length, 'posts ++', 138, 'line.' );
      // Home.html //
      let header = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Blog Sample Posts</title>
          <link rel="icon"  href="../G-blog/icon192.png" type="image/icon">
          <link rel="stylesheet" href="../G-blog/style.css">
          <!-- ... --> 
          <script src="../G-blog/app.js"></script>  
        </head>
        <body> <a href="/blog" class="logo" title='Go to Home page.'> → Home </a>`
      let body =  `<p>Samples = ${items.length}</p>` + items.map(post => `
        <article class="post-card">
          <h3 title="The post title">       <u> Title    </u> : ${post.title}</h3>
          <p title="post excerpt, in short"><u> Excerpt  </u> : ${post.excerpt}</p>
          <span title="The Post Category">  <u> Category </u> : ${post.category}</span><br><br>
          <a class="read-more" href="/samplepost-${languges}?id=${post.id}">Read more →</a><hr>
        </article>
      `).join(""); 
      let footer = `<br> <footer class="footer">
            <div class="container">
              <span id="play-status" style="font-size: smaller;" title="Content speaking status."></span>
              <p title="Dapvv4500-06.05.2026-TTS updated.">© <span id="year"></span> Tutap4500 Blog. All rights reserved.</p>  
            </div>
          </footer>
          </body>
        </html>`

      return header + body + footer;
    }; // helper

  } //fetch
}; //export
