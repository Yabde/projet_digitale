import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';

const Main = () => {

    const [items, setItems] = useState([]);
    const [itemid, setItemid] = useState("");
    const [routeRedirect, setRedirect] = useState("");

    const getItems = () => {
        fetch("http://localhost:5000/api/data")
            .then(res => {
                return res.json();      // get the 'items' data object inside this response : res
            }).then(items => {
                console.log("Data get back from server: ", items);
                setItems(items.data);
            }).catch(err => {
                console.log(err);
            })
    }

    // To load the dataset from FLASK 
    useEffect(() => {
        getItems();
    }, [])

    // After deleting an item -> Redirect to main page
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

    // If we had a response : DISPLAY all images 
    let itemsArray;
    if (items.length > 0) {
        itemsArray = <div className="album py-3 bg-light">
            <div className="container">
                <div className="row">

                    {items.map(item => {
                        return (
                            <div className="col-md-3" key={item._id}>
                                <div className="card mb-3 shadow-sm">
                                    <Link to={"item/" + item._id}>
                                        <img src={item.imageUrl} className="card-img-top"></img>
                                    </Link>
                                    <div className="card-body">
                                        <h5 className="card-title">Name : {item.predictionName}</h5>
                                        <p className="card-text">Number of Object detected : </p>
                                        {/* <p className="card-text">Class Name : {item.coordinates}</p> */}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-sm btn-outline-secondary btn-outline-success">OK</button>
                                                <Link to={"item/" + item._id}>
                                                    <button type="button" className="btn btn-sm btn-outline-secondary btn-outline-danger">View / Edit</button>
                                                </Link>
                                            </div>
                                            <button className="delete btn btn-sm btn-outline-secondary btn-outline-warning"
                                                onClick={(e) => deleteItem(item._id)}>
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    } else {
        itemsArray = <div>
            <p>Nothing to show !</p>
        </div>
    }

    return (
        <React.Fragment>

            {itemsArray}

        </React.Fragment>
    )
}

export default Main;