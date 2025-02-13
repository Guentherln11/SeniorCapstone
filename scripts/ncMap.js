const width = 500;
    const height = 500;

    const svg = d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height);


    d3.json('https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson')
    .then(geo=>{
        console.log(geo);

        const data = {...geo, features:geo.features.filter(d => d.properties.STATEFP === "37")};

        const projection = d3.geoMercator().fitSize([width, height], data);

        const path = d3.geoPath(projection)

        svg.selectAll('path')
            .data(data.features)   
            .join('path')
            .attr('d',d=>path(d))
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .on('mouseover', (event, d) => {
                    svg.append('text')
                        .attr('class', 'tooltip')
                        .attr('x', d3.pointer(event)[0])
                        .attr('y', d3.pointer(event)[1])
                        .attr('text-anchor', 'middle')
                        .attr('dy', -10)
                        .text(d.properties.NAME);
                })
                .on('mouseout', (event, d) => {
                    svg.selectAll('.tooltip').remove();
                });
    })