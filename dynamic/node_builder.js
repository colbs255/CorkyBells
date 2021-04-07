class NodeBuilder {
    constructor(type) { this.htmlNode = NodeBuilder.of(type); }

    classes(...classes) {
        classes.forEach(classType => this.htmlNode.classList.add(classType));
        return this;
    }

    id(id) {
        this.htmlNode.id = id;
        return this;
    }

    href(href) {
        this.htmlNode.href = href;
        return this;
    }

    attribute(key, value) {
        this.htmlNode.setAttribute(key, value);
        return this;
    }

    child(node) {
        this.htmlNode.appendChild(node);
        return this;
    }

    children(iterable, childGenerator) {
        for (const x of iterable) {
            const e_elem = childGenerator(x);
            if (!(e_elem == null)) {
                this.htmlNode.appendChild(e_elem);
            }
        }
        return this;
    }

    apply(consumer) {
        consumer(this);
        return this;
    }

    textContent(content) {
        this.htmlNode.textContent = content;
        return this;
    }

    innerHTML(content) {
        this.htmlNode.innerHTML = content;
        return this;
    }

    innerText(content) {
        this.htmlNode.innerText = content;
        return this;
    }

    build() { return this.htmlNode; }

    static of(type, ...classes) {
        const e_node = document.createElement(type);
        classes.forEach(classType => e_node.classList.add(classType));
        return e_node;
    }

}
