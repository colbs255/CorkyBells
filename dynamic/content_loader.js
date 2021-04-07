g_contentHandlers = {
    "header": constructHeader,
    "paragraph": constructParagraph,
    "image-basic": constructBasicImage,
    "image-left-right": constructImageLeftRight,
    "callout": constructCallout,
    "v-stack": constructVStack,
    "h-stack": constructHStack,
    "gallery": constructGallery,
    "form": constructForm
};

function buildContentElement(contentNode) {
    const nodeType = contentNode.type;
    if (nodeType in g_contentHandlers) {
        return g_contentHandlers[contentNode.type](contentNode);
    } else {
        const msg = "Unsupported content type: " + nodeType 
            + " for node: " + contentNode.name;
        console.log(msg);
        return new NodeBuilder("h1").textContent(msg).build();
    }
}

function constructVStack(contentNode) {
    return new NodeBuilder("div")
        .children(contentNode.content, 
            contentChild => new NodeBuilder("div").classes("row")
                .child(
                    new NodeBuilder("div").classes("col")
                        .child(buildContentElement(contentChild))
                        .build()
                )
                .build()
        )
        .build();
}

function constructHStack(contentNode) {
    const e_row = new NodeBuilder("div").classes("row")
        .children(contentNode.content, 
            contentChild => new NodeBuilder("div").classes("col")
                .child(buildContentElement(contentChild)).build()
        ).build();
    
    return new NodeBuilder("div").child(e_row).build();
}

function constructParagraph(contentNode) {
    // return new NodeBuilder("p").textContent(contentNode.content).build();
    return new NodeBuilder("p")
        .innerText(contentNode.content).build();
}

function constructBasicImage(contentNode) {
    return new NodeBuilder("div").classes("text-center")
        .child(
            new NodeBuilder("img").classes("img-fluid")
                .attribute("src", contentNode.content).build()
        ).build();
}

function constructCallout(contentNode) {
    return new NodeBuilder("div").classes("alert", "alert-warning")
        .attribute("role", "alert")
        .textContent(contentNode.content)
        .build();
}

function constructImageLeftRight(contentNode) {
    
}

function constructHeader(contentNode) {
    return new NodeBuilder("h1").textContent(contentNode.content).build();
}

var galleryId = 0;
function constructGallery(contentNode) {
    galleryId += 1;
    const id = "gallery" + galleryId;

    const indices = [];
    var i = 0;
    contentNode.content.forEach(_ => indices.push(i++));

    const indicators = new NodeBuilder("ol").classes("carousel-indicators")
        .children(indices,
            index => new NodeBuilder("li")
                .attribute("data-target", "#" + id)
                .attribute("data-slide-to", index)
                .build()
        ).build();

    const e_galleryInner = new NodeBuilder("div").classes("carousel-inner")
        .children(contentNode.content,
            img => new NodeBuilder("div",).classes("carousel-item")
                .child(
                    new NodeBuilder("img").classes("d-block", "w-100")
                        .attribute("src", img.src)
                        .attribute("alt", img.name)
                        .build()
                ).build()
        ).build();

    if (contentNode.content.length > 0) 
    {
        e_galleryInner.childNodes[0].classList.add("active");
        indicators.childNodes[0].classList.add("active");
    }

    const e_prevButton = new NodeBuilder("a").classes("carousel-control-prev")
        .attribute("role", "button").attribute("data-slide", "prev")
        .href("#" + id)
        .child(
            new NodeBuilder("span").classes("carousel-control-prev-icon")
                .attribute("aria-hidden", "true").build()
        )
        .child(NodeBuilder.of("span", "sr-only"))
        .build();

    const e_nextButton = new NodeBuilder("a").classes("carousel-control-next")
        .attribute("role", "button").attribute("data-slide", "next")
        .href("#" + id)
        .child(
            new NodeBuilder("span").classes("carousel-control-next-icon")
                .attribute("aria-hidden", "true").build()
        )
        .child(NodeBuilder.of("span", "sr-only"))
        .build();

    return new NodeBuilder("div").classes("carousel", "slide")
        .id(id)
        .apply(builder => {
            if (contentNode.autoSlide == "false")
                builder.attribute("data-interval", "false");
        })
        .attribute("data-ride", "carousel")
        .child(indicators)
        .child(e_galleryInner)
        .child(e_prevButton)
        .child(e_nextButton)
        .build();
}

function constructNavBar(navBarNode, activeElementId="menu") {
    const dropDownId = "navbarNavDropdown";
    const brandNode = navBarNode.brand;
    return new NodeBuilder("nav").classes("navbar", "navbar-expand-lg", "navbar-dark", "bg-dark")
        .child(
            new NodeBuilder("a").classes("navbar-brand")
                .href(brandNode.link)
                .textContent(brandNode.title)
                .build()
        )
        .child(
            new NodeBuilder("button").classes("navbar-toggler")
                .attribute("type", "button")
                .attribute("data-toggle", "collapse")
                .attribute("data-target", "#" + dropDownId)
                .attribute("aria-controls", dropDownId)
                .attribute("aria-expanded", "false")
                .attribute("aria-label", "Toggle navigation")
                .child(
                    new NodeBuilder("span").classes("navbar-toggler-icon").build()
                ).build()
        )
        .child(
            new NodeBuilder("div").classes("collapse", "navbar-collapse")
                .id(dropDownId)
                .child(
                    new NodeBuilder("ul").classes("navbar-nav", "mr-auto")
                        .children(navBarNode.items,
                            item => { return constructNavBarElement(item, activeElementId == item.id); }
                        )
                        .build()
                ).build()
        ).build();
}

function constructNavBarElement(navBarNode, isActive)
{
    const dropdownId = "navbarDropdownMenuLink";
    const activeClass = isActive ? "active" : null;

    return navBarNode.dropdown
        ? new NodeBuilder("li").classes("nav-item", "dropdown", activeClass)
            // active class here
            .child(
                new NodeBuilder("a").classes("nav-link", "dropdown-toggle")
                    .id(dropdownId)
                    .attribute("role", "button")
                    .attribute("data-toggle", "dropdown")
                    .attribute("aria-haspopup", "true")
                    .attribute("aria-expanded", "false")
                    .textContent(navBarNode.title)
                    .build()
            )
            .child(
                new NodeBuilder("div").classes("dropdown-menu")
                    .attribute("aria-labelledby", dropdownId)
                    .children(navBarNode.dropdown,
                        dropItem => new NodeBuilder("a").classes("dropdown-item")
                            .href(dropItem.link)
                            .textContent(dropItem.title)
                            .build()
                    )
                    .build()
            )
            .build()
        : new NodeBuilder("li").classes("nav-item", activeClass)
            // or here
            .child(
                new NodeBuilder("a").classes("nav-link")
                .href(navBarNode.link)
                .textContent(navBarNode.title)
                .build()
            )
            .build();
}

function constructFooter(footer) {
    return new NodeBuilder("footer")
        .child(
            new NodeBuilder("p")
                .textContent(footer)
                .build()
        ).build();
}


function buildPage(e_root, pageData) {
    document.title = cc_navBar.title;

    e_root.before(
        constructNavBar(cc_navBar.content, pageData.id),
        new NodeBuilder("div").classes("place-holder").build()
    );

    e_root.appendChild(
        new NodeBuilder("h1").classes("pageTitle").textContent(pageData.title).build()
    );

    pageData.content.forEach(
        contentNode => e_root.appendChild(buildContentElement(contentNode))
    );

    const footer = constructFooter(cc_navBar.footer);
    e_root.after(footer);
    footer.before(NodeBuilder.of("hr"));
}

const e_body = document.getElementById("body-root");
buildPage(e_body, cc_content);
