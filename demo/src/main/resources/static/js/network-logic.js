/**
 * Lógica de Topología de Red Cuántica
 */

document.addEventListener("DOMContentLoaded", function() {
    initNetwork();
});

async function initNetwork() {
    try {
        const response = await fetch('/data/architecture.json');
        const data = await response.json();

        // 1. Definimos posiciones fijas (X, Y) para que no se muevan
        // Ajusta estos valores para que queden exactamente como en tu dibujo
        const fixedPositions = {
            'A': { x: -350, y: -50 },
            'B': { x: -200, y: 120 },
            'C': { x: -50, y: -50 },
            'D': { x: 100, y: 120 },
            'E': { x: 350, y: -50 },
            'F': { x: 600, y: 120 }
        };

        // 2. Mapeo de Nodos con iconos
        const nodes = data.nodes.map(n => {
            const isQuantum = n.node_type === 'QN';
            return {
                id: n.id,
                label: n.id,
                x: fixedPositions[n.id]?.x || 0,
                y: fixedPositions[n.id]?.y || 0,
                shape: 'image',
                // Asegúrate de tener estas imágenes en static/images/
                image: isQuantum ? '/images/quantum_node.png' : '/images/classic_node.png',
                size: 35,
                font: { background: '#ffffff', strokeWidth: 2, strokeColor: '#ffffff' },
                raw: n // Guardamos el objeto original para la tabla
            };
        });

        // 3. Mapeo de Enlaces (Color oro para QKD, Negro punteado para Clásicos)
        const edges = [];
        
        // Enlaces Cuánticos
        data.links.forEach(l => {
            edges.push({
                from: l.source,
                to: l.target,
                color: { color: '#d4af37', highlight: '#ffcc00' },
                width: 4,
                raw: l,
                description: 'Enlace Cuántico (QKD)'
            });
        });

        // Enlaces Clásicos
        data['classical-links'].forEach(l => {
            edges.push({
                from: l.source,
                to: l.target,
                color: { color: '#333333', highlight: '#000000' },
                width: 2,
                dashes: [5, 5],
                raw: l,
                description: 'Enlace de Datos Clásico'
            });
        });

        // 4. Configuración de Inmovilidad Total
        const options = {
            physics: { enabled: false }, // Sin gravedad ni rebotes
            interaction: {
                dragNodes: false,  // No se pueden mover nodos
                dragView: false,   // No se puede arrastrar el fondo
                zoomView: false,   // No hay zoom con la rueda
                hover: true
            },
            nodes: { borderWidth: 0 },
            edges: { selectionWidth: 2 }
        };

        const container = document.getElementById('mynetwork');
        const network = new vis.Network(container, { nodes, edges }, options);

        // 5. Manejador de clics para rellenar la tabla
        network.on("click", function(params) {
            const detailContent = document.getElementById('detail-content');
            const placeholder = document.getElementById('placeholder-text');
            const tableBody = document.getElementById('table-body');
            const detailTitle = document.getElementById('detail-title');

            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const nodeData = nodes.find(n => n.id === nodeId).raw;
                
                placeholder.style.display = 'none';
                detailContent.style.display = 'block';
                detailTitle.innerText = "Información del Nodo: " + nodeId;
                
                renderTable(nodeData, tableBody);
            } 
            else if (params.edges.length > 0) {
                const edgeId = params.edges[0];
                // Buscamos el enlace clickeado
                const edgeData = edges.find(e => e.id === edgeId || (e.from === params.items[0]?.from && e.to === params.items[0]?.to)).raw;
                
                placeholder.style.display = 'none';
                detailContent.style.display = 'block';
                detailTitle.innerText = "Información del Enlace";
                
                renderTable(edgeData, tableBody);
            }
        });

    } catch (error) {
        console.error("Error cargando la topología:", error);
    }
}

function renderTable(obj, container) {
    container.innerHTML = "";
    for (let key in obj) {
        // Saltamos campos internos si los hay
        if (key === 'source' || key === 'target') {
            const row = `<tr><th>${key.toUpperCase()}</th><td>${obj[key]}</td></tr>`;
            container.innerHTML += row;
            continue;
        }
        const row = `<tr><th>${key.replace(/_/g, ' ').toUpperCase()}</th><td>${obj[key]}</td></tr>`;
        container.innerHTML += row;
    }
}