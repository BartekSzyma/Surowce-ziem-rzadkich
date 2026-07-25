// interaktywny graf sieci (vis-network)
(function () {
  if (!window.GRAPH || !window.vis) return;
  var COL = { moc: "#e6447a", temat: "#2f81f7", spolka: "#3fb950", indeks: "#a371f7" };
  var nodes = window.GRAPH.nodes.map(function (n) {
    var size = 12 + Math.min(n.val, 24) * 1.6;
    return {
      id: n.id, label: n.label, url: n.url, group: n.group,
      value: n.val, shape: "dot", size: size,
      color: { background: COL[n.group], border: "#0d1117",
               highlight: { background: COL[n.group], border: "#fff" } },
      font: { color: "#d7dee7", size: 14, face: "Segoe UI",
              strokeWidth: 4, strokeColor: "#0d1117" }
    };
  });
  var edges = window.GRAPH.edges.map(function (e) {
    return { from: e.from, to: e.to, color: { color: "rgba(139,151,166,.28)", highlight: "#58a6ff" },
             width: 1, smooth: { type: "continuous" } };
  });
  var container = document.getElementById("net");
  var data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  var options = {
    physics: { barnesHut: { gravitationalConstant: -7000, springLength: 130, springConstant: 0.03, damping: 0.35 },
               stabilization: { iterations: 250 } },
    interaction: { hover: true, tooltipDelay: 120, navigationButtons: false, keyboard: false },
    nodes: { borderWidth: 2 },
    edges: { selectionWidth: 2 }
  };
  var net = new vis.Network(container, data, options);
  net.on("click", function (params) {
    if (params.nodes.length) {
      var n = data.nodes.get(params.nodes[0]);
      if (n && n.url) window.location.href = n.url;
    }
  });
  net.on("hover", function(){ container.style.cursor = "pointer"; });
  net.on("blurNode", function(){ container.style.cursor = "default"; });
})();
