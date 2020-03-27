import React, { useEffect, useState } from "react";

const Create = () => {
    // [String, Function] -> First they'll be set with State of an empty String
    const [predictionName, setpredictionName] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const isimageUrlReady = imageUrl;
    let imageUrlPreview;

    // imageUrl to Show regarding if it exist or not...
    if (isimageUrlReady) {
        imageUrlPreview = <img className="preview card-img-top" src={imageUrl} alt="product" />
    }

    // Function to call when cliking on Submit button
    const createItem = (event) => {
        event.preventDefault();  // Block the web Browser to refresh after submiting
        console.log("coucou")

        // Create an Object to be send the FLASK Api
        const item = {
            predictionName: predictionName,
            // coordinates: coordinates,
            imageUrl: imageUrl
        }

        const options = {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        }

        // Receive our respon here : Connection to the FLASK Api
        if (imageUrl && predictionName) {
            fetch("http://localhost:5000/api/save", options)
                .then(res => {
                    return res.json();
                }).catch(err => {
                    console.log(err)
                })
        } else {
            console.log("Form not valid")
        }
    }

    return (
        <React.Fragment>

            <form className="create " onSubmit={createItem}>
                <div className="col-md-5 mx-auto">
                    <section className="p-5" style={{ padding: "10" }}>

                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title">New item</h2>
                            </div>
                            <div className="form-row">
                                <div className="col">
                                    <label htmlFor="predictionName">image Name: </label>
                                    <input type="text"
                                        name="PredictionName"
                                        className="form-control"
                                        placeholder="Name"
                                        onChange={e => setpredictionName(e.target.value)} />
                                </div>

                            </div>

                            <div className="form-group">
                                <label htmlFor="imageUrl">image URL</label>
                                <input type="text"
                                    name="imageUrl"
                                    className="form-control"
                                    placeholder="URL"
                                    onChange={e => setImageUrl(e.target.value)} />
                            </div>

                            <input type="submit" className="btn btn-sm btn-outline-secondary btn-outline-success" value="create Item" />

                            <div>
                                <section className="p-5">
                                    {imageUrlPreview}
                                </section>

                            </div>
                        </div>
                    </section>
                </div>
            </form>

        </React.Fragment >
    )
}

export default Create;