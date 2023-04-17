const data = [
  {
    id: "123",
  },
  {
    id: "122",
  },
];

const [id, id2] = data;
console.log(id, id2);

const sources = [{id: "frame1"}, {id: "frame2"}, {id:"frame3"}, {id:"frame4"}];
const target = [1, 2];
const targetWindow = ["frame1", "frame2"];
const res = sources.filter((source) => targetWindow.includes(source.id));
console.log(res);
