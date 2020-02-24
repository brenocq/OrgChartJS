# OrgChartJS
Organization Chart with create/edit/move features.


## How to install
Just put the css and js files on your folder and call them like:
```
<link rel="stylesheet" type="text/css" href="../css/OrgChart.css">
<script src="../js/OrgChart.js"></script>
```
You also need to call jQuery and font-awesome.
## How to use
First, you need to create a div with your chart id.
```
<div id="myOrgChart"></div>
```
After that, create the OrgChart object
```
let chart;
window.onload = function () {
     chart = new OrgChart(document.getElementById("myOrgChart"), {
         config: {
             canEdit: true,
             canMove: true,
             canCreate: true,
             height: 500,
             width: 1500,
           heightNode: 50,
           widthNode: 150,
           margin: 15
       },
       nodes: [
           { id: 0, name: "CEO" },
           { id: 1, pid: 0, name: "Manager 1" },
           { id: 2, pid: 0, name: "Manager 2" },
           { id: 3, pid: 0, name: "Manager 3" },
           { id: 4, pid: 1, name: "Supervisor" },
           { id: 5, pid: 4, name: "Developer" },
           { id: 6, pid: 4, name: "Developer" },
           { id: 7, pid: 2, name: "Marketing 1" },
           { id: 8, pid: 2, name: "Marketing 2" },
           { id: 9, pid: 8, name: "Intern 1" },
           { id: 10, pid: 8, name: "Intern 2" },
       ]
   });
};
```
#### Customizing your OrgChart
There are some functions you can edit to add more features to your organization chart.
In the bottom of the `OrgChart.js` file, there are functions like:
- createNode(parentId)
- editNode(nodeId)

You can add pop-ups or events as you wish to customize the creation and editing of your nodes here.
## Dependencies
- Jquery
- font-awesome

## License
This code is available under MIT license.
