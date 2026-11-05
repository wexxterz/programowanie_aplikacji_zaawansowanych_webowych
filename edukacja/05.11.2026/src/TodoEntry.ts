class TodoEntry{
    id: number;
    title: string;
    desctription?: string;
    isDone?: boolean;

    constructor(id:number,title:string) {
        this.id = id;
        this.title = title;
    }
    render(){
        return `
<div class="card card-body mt-1 shadow">
    <p class="small">${this.title}</p>
    <h3 class="h3">${this.title}</h3>
    <button class="btn btn-danger">Delete</button>
</div>
`;
    }
}