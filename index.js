import {IfcViewerAPI} from 'web-ifc-viewer';
import {Color} from 'three';
import {IFCSPACE, IFCOPENINGELEMENT} from 'web-ifc';



const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({container});
viewer.clipper.active = true;
viewer.addAxes();
viewer.addGrid(20,20);

viewer.context.renderer.usePostproduction = true;

let tree;

const GUI = {
    input: document.getElementById('file-input'),
    loader: document.getElementById('loader-button'),
    props: document.getElementById('property-menu'),
    tree: document.getElementById('myUL')
}

GUI.loader.onclick = () => GUI.input.click();

GUI.input.onchange = (event) => {
const file = event.target.files[0];
const url = URL.createObjectURL(file);
//const model = await viewer.IFC.loadIfcUrl(url);
}

async function loadModel(){
const model = await viewer.IFC.loadIfcUrl('myIFC.ifc');
createTreeMenu(model.modelID);
}

loadModel();

container.onmousemove = () => viewer.IFC.prePickIfcItem();

container.ondblclick = async() => {
    const found = await viewer.IFC.pickIfcItem(true);
    if(found === null || found === undefined) return;
    const props = await viewer.IFC.getProperties(found.modelID, found.id, true);
    updatePropertyMenu(props);
}


function updatePropertyMenu(props){

    removeAllChildren(GUI.props);

    const mats = props.mats;
    const psets = props.psets;
    const type = props.type;

    delete props.mats;
    delete props.psets;
    delete props.type;

    for (let propertyName in props){
        const propValue = props[propertyName];
        createPropertyEntry(propertyName, propValue);
    }
    }

    function createPropertyEntry(key, propertyValue){
        //contenedor
        const root = document.createElement('div');
        root.classList.add('property-root');

        //Nombre de la propiedad

        const keyElement = document.createElement('div');
        keyElement.classList.add('property-name');
        keyElement.textContent = key;
        root.appendChild(keyElement);

        //valor de la propiedad
        if(propertyValue === null || propertyValue === undefined) propertyValue = "unbekannt";
        else if (propertyValue.value) propertyValue = propertyValue.value;

        const valueElement = document.createElement('div');
        valueElement.classList.add('property-value');
        valueElement.textContent = propertyValue;
        root.appendChild(valueElement);

        GUI.props.appendChild(root);
    }

    function removeAllChildren(element){
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }

    //menu tree

    var toggler = document.getElementsByClassName("caret");

    for (let i = 0; i < toggler.length; i++) {
        const current = toggler[i];
            current.onclick = () => {
            current.parentElement.querySelector(".nested").classList.toggle("active");
            current.classList.toggle("caret-down");
            }
    }

        async function createTreeMenu(modelID){
        ifcProject = await viewer.IFC.getSpatialStructure(modelID);
        removeAllChildren(GUI.tree);

        const ifcProjectNode = createNestedChild(GUI.tree, ifcProject);
        ifcProject.children.forEach(child => {
            constructTreeMenuNode(ifcProjectNode, child)
        })
        }

    function constructTreeMenuNode(parent, node){
        const children = node.children;
        if (children.length === 0) {
            createSimpleChild(parent, node);
            return;
        }
        const nodeElement = createNestedChild (parent, node);
        children.forEach(child => {
            constructTreeMenuNode(nodeElement, child);
        })
    }

    function createNestedChild(parent, node){
        const content = nodeToString (node);
        const root = document.createElement('li');
        createNestedNodeTitle(root, content);
        const childrenContainer = document.createElement('ul');
        childrenContainer.classList.add('nested');
        root.appendChild(childrenContainer);
        parent.appendChild(root);
        return childrenContainer;

    }

    function createNestedNodeTitle(parent, content){
        const title = document.createElement('span');
        title.classList.add('caret');
        title.onclick = () => {
            title.parentElement.querySelector(".nested").classList.toggle("active");
            title.classList.toggle("caret-down");
        }
        title.textContent = content;
        parent.appendChild(title);
    }

    function createSimpleChild(parent, node){
        const childNode = document.createElement('li');
        childNode.classList.add('leaf-node');
        childNode.textContent = nodeToString(node);
        parent.appendChild(childNode);
   

        childNode.onmouseenter = () => {
        viewer.IFC.prepickIfcItemsByID(0, [node.expressID]);
        }
    }

    childNode.onclick = async () => {
        viewer.IFC.pickIfcItemsByID(0, [node.expressID], true);
        const props = await viewer.IFC.getProperties(0, expressID, true);
        updatePropertyMenu(props);
    }   

    function nodeToString(node){
        return `${node.type} - ${node.expressID}`;
        
    }
