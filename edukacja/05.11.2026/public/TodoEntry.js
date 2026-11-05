class TodoEntry {
    id;
    title;
    desctription;
    isDone;
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
    render() {
        return `
          <div class="card card-body mt-1 shadow">
          <p class="small">${this.title}</p>
          <h3 class="h3">${this.title}</h3>
          <button class="btn btn-danger">Delete</button>
          </div>
        `;
    }
}
export default TodoEntry;
