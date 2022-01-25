import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
  title = "This is a title";
  description = '';
  node = {
    name: 'root', children: [
      { name: 'a', children: [] 
      },
      {
        name: 'b', children: [
          { name: 'b-1', children: [] },
          {
            name: 'b-2', children: [
              { name: 'b-2-1', children: [] },
              { name: 'b-2-2', children: [] },
              { name: 'b-2-3', children: [] }
            ]
          }
        ]
      },
      {
        name: 'c', children: [
          { name: 'c-1', children: [] },
          { name: 'c-2', children: [] }
        ]
      },
    ]
  };
  constructor() { }
  

  ngOnInit(): void {
  }

}
