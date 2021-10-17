# You Don't Need React!

You don't need React. This isn't a joke. I'm not trying to make you use another framework like Angular either. Angular is even bigger and you don't need it either. The fact is you don't need a framework at all. You can just write plain JavaScript. Before you click away please let me explain.

React came at a time when the web specifications were not as far as they are today. Creating your own custom HTML tags was an idea largely founded by React and adopted by every framework under the sun. Even the Angular folks abandoned their MV\* approach to adopt a component framework. The idea was foundational to how the web is developed today. I love React too. I have a significant amount of development experience in it. I would even say it is the framework I am most profficient in. But I don't know that we need it today.

## Today's Web

Today's web has Custom Elements under the Web Components specification. This allows a person to write a custom HTML element with JavaScript, HTML, and CSS. It also comes packaged along with a way to register the element to the web page and has a method of encapsulating the element from side effects of the rest of the page's JavaScript called the Shadow DOM.

Right now you may be shouting about how your app needs XYZ library and that React or your Framework of choice has a great integration wit it. To be honest you probably don't need that XYZ library either, but even if you do need it, you can still write you app without the React integration. I'm sure the Author wrote the library completely agnostic to that integration.

JSX is so elegant. You don't need it though. Writing Components in React should've taught you to write you components very small and to encapsulate the JavaScript and styles from the rest of the page. If you follow these principles in Custom Element construction you also don't need JSX. String literal construction works just fine.

You could make the jump to lit-element or Stenciljs and they at least compile to Native Web Components, but you don't need those either. The overhead while smaller than React is still not needed.

## Learn JavaScript Not a Framework

You need to learn how to write JavaScript not another shiny framework. I've spent years chasing the Framework dragon. My journey took me from Polymer 0.5 -> RiotJS -> React -> Angular 2.0+ -> StencilJS -> VueJS. I can say that they all work. And they all miss the mark. Polymer just wasn't there at the time. RiotJS never really gained a ton of traction. React oddly decided to break Web Components by doing some wierd synthetic event stuff. Angular 2.0+ will require you to learn how to fly a plane to use. StencilJS is cool, but makes you want to write React instead. VueJS is probably the closest as it can also compile to Web Components, but it still puts a ton of overhead on the generated component. Also each one of these frameworks requires a build system and tons of tooling which take a ton of time to learn and set up. None of them work with each other either.

Native Custom Elements can work in any of those spaces (even React if you're willing to do a bit of work). It requires no build system. You can use it in every modern browser. (Do not say IE11. IE is not modern and needs to die a painful death already). If you spend a little bit of time learning how to write JavaScript and use the new specification you can save yourself the hassle of learning another framework, all the build tools, and prevent your website from becoming obsolete.

## Wrapping Things Up

React is not bad, but it is a artifact that we don't need anymore. Facebook built it to solve a very specific problem and I'm sure it'll work for them for years to come. You probably don't have the same problem they do and bolting their 2000 pound Gorilla to your customers custom tool probably won't solve the problem the best way. Try to keep the website as simple as possible while building it and go as native as possible.
