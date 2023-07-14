const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// fetch the data from the json file
d3.json(url).then((data) => {
    console.log(data);
    
});

// initialize dashboard 
function init() {

    // use d3 to select dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // variable for sample names
    d3.json(url).then((data) => {
        let names = data.names;

        // add samples to dropdown menu and log values
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option").text(id).property("value", id);
        });

        // set the first sample
        let firstSample = names[0];
        console.log(firstSample);

        // build initial plots
        buildMetadata(firstSample);
        buildBarchart(firstSample);
        buildBubblechart(firstSample);
    });
}

// function that populates metadata info
function buildMetadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter((result) => result.id == sample);
        console.log(value);

        //get first index from array
        let valueData = value[0];

        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key, value]) => {

            // log key and value to append to metadata panel
            console.log(key, value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
}

// build bar chart
function buildBarchart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter((result) => result.id == sample);
        let valueData = value[0];

        // get ids, labels, and values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // log data
        console.log(otu_ids, otu_labels, sample_values);

        // slice top 10 items
        let yticks = otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0, 10).reverse();
        let labels = otu_labels.slice(0, 10).reverse();

        // set up trace
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h",
        };

        // set up layout
        let layout = {
            title: "Top 10 OTUs",
        };

        Plotly.newPlot("bar", [trace], layout);
    });
}

// function to create bubble chart
function buildBubblechart(sample) {

    // retrieve data using d3
    d3.json(url).then((data) =>{
        let sampleInfo = data.samples;

        // filter by value of samples
        let value = sampleInfo.filter((result) => result.id == sample);
        let valueData = value[0];

        // get ids, labels, and values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // log data
        console.log(otu_ids, otu_labels, sample_values);

        // set up trace
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Portland",
            },
        };

        // set up layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // plot bubble chart
        Plotly.newPlot("bubble", [trace1], layout);
    });
}

// function to update dashboard when sample is changed
function optionChanged(value) {
    console.log(value);

    // call all functons
    buildMetadata(value);
    buildBarchart(value);
    buildBubblechart(value);
}

// initialize function
init();
