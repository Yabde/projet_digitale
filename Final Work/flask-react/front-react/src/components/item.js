import React, { useState, useEffect, Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import ReactDOM from "react-dom";
// For annotation Box
import { ReactPictureAnnotation } from "react-picture-annotation";

const Item = (props) => {
    const [item, setItem] = useState({});
    const [itemid, setItemid] = useState("");
    const [editMode, setEditMode] = useState(false);

    const [predictionName, setPredictionName] = useState("");
    // const [coordinates, setCoordinates] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [routeRedirect, setRedirect] = useState("");

    // For Annotation Box
    const [pageSize, setPageSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const onResize = () => {
        setPageSize({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const onSelect = selectedId => console.log(selectedId);
    const onChange = data => console.log(data);

    // To get data from Flask API
    const getItem = () => {
        let id = props.match.params.id;
        setItemid(id);

        fetch("http://localhost:5000/api/data/" + id)
            .then(res => {
                return res.json();
            }).then(res => {
                let parsedResponse = JSON.parse(res.data);
                setItem(parsedResponse);   // Everything 
                setPredictionName(parsedResponse.predictionName);
                // setCoordinates(parsedResponse.coordinates);
                setImageUrl(parsedResponse.imageUrl);
            }).catch(err => {
                console.log(err);
            })
    }

    // Get our Data
    useEffect(() => {
        getItem();
    }, []);

    const ediItem = (itemid) => {
        console.log(itemid)
        setEditMode(!editMode);
    }

    const updateItem = (e) => {
        e.preventDefault();
        // Object that will be send
        const item = {
            itemid: itemid,
            predictionName: predictionName,
            // coordinates: coordinates,
            imageUrl: imageUrl
        }

        // To update it : 'PUT'
        const options = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        }

        fetch("http://localhost:5000/api/update/" + itemid, options)
            .then(res => {
                return res.json();
            }).then(res => {
                console.log(res)
                setRedirect(true);
            }).catch(err => {
                console.log(err)
            });
    }

    const redirect = routeRedirect;
    if (redirect) {
        return <Redirect to="/" />
    }

    // To delete it : 'DELETE'
    const deleteItem = (itemid) => {
        const options = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: itemid })
        }

        fetch("http://localhost:5000/api/delete/" + itemid, options)
            .then(res => {
                return res.json();
            }).then(res => {
                console.log(res)
                setRedirect(true);
            }).catch(err => {
                console.log(err)
            });
    }

    let annotation_box;
    let editForm;
    if (editMode) {
        annotation_box = <ReactPictureAnnotation
            image={item.imageUrl}
            onSelect={onSelect}
            onChange={onChange}
            width={pageSize.width}
            height={pageSize.height} />

        editForm = <React.Fragment>
            <form className="editForm" onSubmit={updateItem}>
                <div className="p-1 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Updates</h5>
                        </div>
                        <div className="form-row">
                            <div className="col">
                                <label htmlFor="name">Prediction Labels : </label>
                                <textarea
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    onChange={e => setPredictionName(e.target.value)} />
                            </div>
                        </div>

                        <div class="form-group">
                            <label htmlFor="imageUrl">image URL</label>
                            <input type="text"
                                name="imageUrl"
                                className="form-control"
                                placeholder="URL"
                                onChange={e => setImageUrl(e.target.value)} />
                        </div>

                        <input type="submit" className="btn btn-sm btn-outline-secondary btn-outline-success" value="create Item" />
                    </div>

                </div>
            </form>
        </React.Fragment>
    }

    return (
        <React.Fragment>
            <div>
                <section className="p-5">
                    <div className="card mb-4 mx-auto">
                        <div className="row no-gutters">
                            <div className="col-md-7">
                                <img src={item.imageUrl} className="card-img rounded-left" ></img>
                            </div>

                            <div className="col-md-5">
                                <div className="card-body">
                                    <h5 className="card-title">Coordinates</h5>
                                    <p className="card-text">
                                        (x1, y1, x2, y2) : <span className="text-info">...</span>
                                        <br />
                                        Label : <span className="text-info">...</span>
                                    </p>
                                    <p className="card-text">
                                        <div className="btn-group">
                                            <Link to={""}>
                                                <button type="button" className="btn btn-sm btn-outline-secondary btn-outline-success">OK</button>
                                            </Link>
                                            <button type="button"
                                                className="edit btn btn-sm btn-outline-secondary btn-outline-danger"
                                                onClick={(e) => ediItem(itemid)}>
                                                ANNOTATION
                                            </button>
                                            <button className="delete btn btn-sm btn-outline-secondary btn-outline-warning"
                                                onClick={(e) => deleteItem(itemid)}>
                                                DELETE
                                            </button>
                                        </div>
                                    </p>
                                    <div className="card">
                                        {editForm}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div>
                    {annotation_box}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Item;