function constructForm(node) {
    return FormBuilder.create(node);
}

const g_formContentHandlers = {
    "name": constructFormName,
    "email": constructFormEmail,
    "number": constructFormNumber,
    "input": constructFormInput
};

class FormBuilder {
    constructor(node) {
        this.id = "colby";
        this.e_node = new NodeBuilder("form")
            // google forms
            .attribute("enctype", "text/plain")
            .attribute("action", node.submit)
            .attribute("target", "hidden_iframe")
            .attribute("onsubmit", "submitted=true")
            // google forms
            .children(node.content, constructFormNode)
            .child(
                new NodeBuilder("button").classes("btn", "btn-primary")
                    .textContent("Submit")
                    .build()
            )
            .build();

        // colby hidden_iframe stuff?
        const e_iFrame = new NodeBuilder("iframe")
            .id("hidden_iframe")
            .attribute("name", "hidden_iframe")
            .attribute("style", "display:none;")
            .attribute("onload", "if(submitted) {}")
            .build();

        this.e_node.onsubmit = function(_) {
            console.log("clicked");
        };
    }

    static create(node) {
        return new FormBuilder(node).e_node;
    }

}

function constructFormNode(formNode) {
    const nodeType = formNode.type;
    if (nodeType in g_formContentHandlers) {
        return g_formContentHandlers[formNode.type](formNode);
    } else {
        const msg = "Unsupported form node type: " + nodeType 
            + " for node: " + formNode.name;
        console.log(msg);
        return new NodeBuilder("h1").textContent(msg).build();
    }
}

function constructFormName(node) {
    return new NodeBuilder("div").classes("form-row")
        .child(
            new NodeBuilder("div").classes("form-group", "col-md-6")
                .child(
                    new NodeBuilder("label")
                        .attribute("for", "firstName")
                        .textContent("First name")
                        .build()
                )
                .child(
                    new NodeBuilder("input").classes("form-control")
                        .id(node.firstNameId)
                        .attribute("name", node.firstNameId)
                        .attribute("type", "text")
                        .attribute("placeholder", "Laura")
                        .build()
                )
                .build() 
        )
        .child(
            new NodeBuilder("div").classes("form-group", "col-md-6")
                .child(
                    new NodeBuilder("label")
                        .attribute("for", "lastName")
                        .textContent("Last name")
                        .build()
                )
                .child(
                    new NodeBuilder("input").classes("form-control")
                        .id(node.lastNameId)
                        .attribute("name", node.lastNameId)
                        .attribute("type", "text")
                        .attribute("placeholder", "Henderson")
                        .build()
                )
                .build() 
        )
        .build();
}

function constructFormEmail(node) {
    return new NodeBuilder("div").classes("form-group")
        .child(
            new NodeBuilder("label")
                .attribute("for", node.name)
                .textContent("Email address")
                .build()
        )
        .child(
            new NodeBuilder("input").classes("form-control")
                .id(node.id)
                .attribute("name", node.id)
                .attribute("type", "email")
                .attribute("aria-describedby", "emailHelp")
                .attribute("placeholder", "Enter email")
                .build()
        )
        .child(
            new NodeBuilder("small").classes("form-text", "text-muted")
                .id("emailHelp")
                .textContent("Don't worry, we only use this to reply to your message :)")
                .build()
        )
        .build();
}

function constructFormNumber(node) {
    return new NodeBuilder("div").classes("form-row")
        .child(
            new NodeBuilder("div").classes("form-group", "col-1")
                .child(
                    new NodeBuilder("input").classes("form-control")
                        .id("areaCode")
                        .attribute("type", "text")
                        .attribute("placeholder", "500")
                        .build()
                )
                .build() 
        )
        .child(
            new NodeBuilder("div").classes("form-group", "col-1")
                .child(
                    new NodeBuilder("input").classes("form-control")
                        .id("middlePhone")
                        .attribute("type", "text")
                        .attribute("placeholder", "234")
                        .build()
                )
                .build() 
        )
        .child(
            new NodeBuilder("div").classes("form-group", "col-2")
                .child(
                    new NodeBuilder("input").classes("form-control")
                        .id("lastDigitsPhone")
                        .attribute("type", "text")
                        .attribute("placeholder", "4565")
                        .build()
                )
                .build() 
        )
        .build();
}

function constructFormInput(node) {
    return new NodeBuilder("div").classes("form-group")
        .child(
            new NodeBuilder("label")
                .attribute("for", node.name)
                .textContent("Message")
                .build()
        )
        .child(
            new NodeBuilder("textarea").classes("form-control")
                .id(node.id)
                .attribute("name", node.id)
                .attribute("rows", "4")
                .attribute("placeholder", "How can we help?")
                .build()
        )
        .build();
}
