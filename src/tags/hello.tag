hello
  h1  { opts.greeting } <trim length="3" value="{ what }">!</trim>
  h3 { opts.title }
  ul
    li(each="{ opts.items }")
      span(class={ completed: done }) { title }
      input(type="checkbox" checked="{ done }")

  form(onsubmit="{ add }")
    input(name="input" onkeyup="{ edit }")
    button(disabled="{ !text }" type=submit) submit
  script.
    this.what = 'Egghead';
    this.items = opts.items;
    edit(e) {
      console.log(e.target.value);
      this.text = e.target.value;
    }

    add(e) {
      this.items.push({
        title: this.text,
        done: false
      });

      this.text = this.input.value = '';
    }

trim
  span { opts.value.substr(0, opts.length) }