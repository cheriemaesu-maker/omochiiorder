/* =================================================
   PRODUCT DATABASE
================================================= */

const products = {

    croissant: {
        name: "Mochi Cookies and Cream",
        price: 10000,
        stock: 3
    },

    chocolate: {
        name: "Mochi Milo",
        price: 10000,
        stock: 3
    },

};


/* =================================================
   LOAD SAVED STOCK
================================================= */

const savedStock =
    localStorage.getItem("bakeryStock");

if (savedStock) {

    const parsedStock =
        JSON.parse(savedStock);

    Object.keys(parsedStock).forEach(id => {

        if (products[id]) {

            products[id].stock =
                parsedStock[id];

        }

    });

}


/* =================================================
   SHOPPING CART
================================================= */

let cart = {};


/* =================================================
   SAVE STOCK
================================================= */

function saveStock() {

    const stockData = {};

    Object.keys(products).forEach(id => {

        stockData[id] =
            products[id].stock;

    });

    localStorage.setItem(
        "bakeryStock",
        JSON.stringify(stockData)
    );

}


/* =================================================
   UPDATE STOCK DISPLAY
================================================= */

function updateStockDisplay() {

    document
        .querySelectorAll(".stock-number")
        .forEach(element => {

            const id =
                element.dataset.id;

            if (!products[id]) return;

            element.textContent =
                products[id].stock;

        });


    document
        .querySelectorAll(".add-button")
        .forEach(button => {

            const id =
                button.dataset.id;

            if (!products[id]) return;

            const stock =
                products[id].stock;


            if (stock <= 0) {

                button.textContent =
                    "SOLD OUT";

                button.disabled = true;

            } else {

                button.textContent =
                    "Add to Order";

                button.disabled = false;

            }

        });

}


/* =================================================
   ADD TO ORDER
================================================= */

function addToOrder(id) {

    const product =
        products[id];

    if (!product) return;


    if (product.stock <= 0) {

        alert(
            "Sorry, this item is sold out!"
        );

        return;

    }


    if (!cart[id]) {

        cart[id] = 1;

    } else {

        if (cart[id] < product.stock) {

            cart[id]++;

        } else {

            alert(
                `Only ${product.stock} ${product.name} available.`
            );

            return;

        }

    }


    renderOrder();

    openOrder();

}


/* =================================================
   CHANGE QUANTITY
================================================= */

function changeQuantity(id, amount) {

    if (!cart[id]) return;


    const newQuantity =
        cart[id] + amount;


    if (newQuantity <= 0) {

        delete cart[id];

    } else if (
        newQuantity > products[id].stock
    ) {

        alert(
            `Only ${products[id].stock} ${products[id].name} available.`
        );

        return;

    } else {

        cart[id] =
            newQuantity;

    }


    renderOrder();

}


/* =================================================
   REMOVE ITEM
================================================= */

function removeFromOrder(id) {

    delete cart[id];

    renderOrder();

}


/* =================================================
   RENDER ORDER
================================================= */

function renderOrder() {

    const orderItems =
        document.getElementById(
            "orderItems"
        );

    const totalElement =
        document.getElementById(
            "orderTotal"
        );

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );


    if (
        !orderItems ||
        !totalElement ||
        !checkoutButton
    ) return;


    orderItems.innerHTML = "";


    const cartIds =
        Object.keys(cart);


    if (cartIds.length === 0) {

        orderItems.innerHTML = `

            <p class="empty-order">
                Your order is empty.
            </p>

        `;

        totalElement.textContent =
            "Rp0";

        checkoutButton.disabled =
            true;

        return;

    }


    checkoutButton.disabled =
        false;


    let total = 0;


    cartIds.forEach(id => {

        const product =
            products[id];

        const quantity =
            cart[id];

        const subtotal =
            product.price * quantity;


        total += subtotal;


        const item =
            document.createElement("div");


        item.className =
            "order-item";


        item.innerHTML = `

            <div class="order-item-info">

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ${formatRupiah(product.price)}
                    each
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="changeQuantity('${id}', -1)">
                    −
                </button>

                <span>
                    ${quantity}
                </span>

                <button
                    onclick="changeQuantity('${id}', 1)">
                    +
                </button>

            </div>


            <strong>
                ${formatRupiah(subtotal)}
            </strong>


            <button
                class="remove-item"
                onclick="removeFromOrder('${id}')">

                Remove

            </button>

        `;


        orderItems.appendChild(item);

    });


    totalElement.textContent =
        formatRupiah(total);

}


/* =================================================
   FORMAT RUPIAH
================================================= */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* =================================================
   OPEN ORDER
================================================= */

function openOrder() {

    const modal =
        document.getElementById(
            "orderModal"
        );

    if (!modal) return;

    modal.classList.add("show");

    renderOrder();

}


/* =================================================
   CLOSE ORDER
================================================= */

function closeOrder() {

    const modal =
        document.getElementById(
            "orderModal"
        );

    if (!modal) return;

    modal.classList.remove("show");

}


/* =================================================
   CHECKOUT + ORDER MANAGEMENT
================================================= */

document
    .getElementById("orderForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* Check cart */

            if (
                Object.keys(cart).length === 0
            ) {

                alert(
                    "Please add something to your order."
                );

                return;

            }


            /* Check stock */

            for (
                const id of Object.keys(cart)
            ) {

                if (
                    cart[id] >
                    products[id].stock
                ) {

                    alert(
                        `${products[id].name} does not have enough stock.`
                    );

                    return;

                }

            }


            /* Calculate total */

            let total = 0;

            const orderItems = [];


            Object.keys(cart).forEach(id => {

                const product =
                    products[id];

                const quantity =
                    cart[id];

                const subtotal =
                    product.price * quantity;


                total += subtotal;


                orderItems.push({

                    id: id,

                    name: product.name,

                    price: product.price,

                    quantity: quantity,

                    subtotal: subtotal

                });

            });


            /* Customer information */

            const customerName =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const customerPhone =
                document
                    .getElementById("customerPhone")
                    .value
                    .trim();


            const orderNotes =
                document
                    .getElementById("orderNotes")
                    .value
                    .trim();


            /* Create order */

            const newOrder = {

                id: generateOrderNumber(),

                customerName:
                    customerName,

                customerPhone:
                    customerPhone,

                notes:
                    orderNotes,

                items:
                    orderItems,

                total:
                    total,

                status:
                    "Pending",

                date:
                    new Date().toLocaleString(
                        "en-ID"
                    )

            };


            /* Save order */

            orders.unshift(
                newOrder
            );

            saveOrders();


            /* Reduce stock */

            Object.keys(cart).forEach(id => {

                products[id].stock -=
                    cart[id];

            });


            saveStock();


            /* Clear cart */

            cart = {};


            updateStockDisplay();

            renderOrder();


            document
                .getElementById("orderForm")
                .reset();


            closeOrder();


            /* Show success */

            document
                .getElementById("successPopup")
                .classList.add("show");

        }
    );

    /* =================================================
   ORDER MANAGEMENT
================================================= */

let orders =
    JSON.parse(
        localStorage.getItem("omochiOrders")
    ) || [];


/* SAVE ORDERS */

function saveOrders() {

    localStorage.setItem(
        "omochiOrders",
        JSON.stringify(orders)
    );

}


/* GENERATE ORDER NUMBER */

function generateOrderNumber() {

    return "OMO-" +
        Date.now().toString().slice(-6);

}

/* =================================================
   SUCCESS POPUP
================================================= */

function closeSuccess() {

    document
        .getElementById("successPopup")
        .classList.remove("show");

}


/* =================================================
   MOBILE NAVIGATION
================================================= */

const menuToggle =
    document.getElementById(
        "menuToggle"
    );

const navLinks =
    document.getElementById(
        "navLinks"
    );


menuToggle.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "active"
        );

    }
);


/* Close menu after clicking */

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.classList.remove(
                    "active"
                );

            }
        );

    });


/* =================================================
   CATEGORY FILTER
================================================= */

const categoryButtons =
    document.querySelectorAll(
        ".category"
    );

const productCards =
    document.querySelectorAll(
        ".product-card"
    );


categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(
                btn => {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            const category =
                button.dataset.category;


            productCards.forEach(card => {

                const cardCategory =
                    card.dataset.category;


                if (
                    category === "all" ||
                    category === cardCategory
                ) {

                    card.style.display =
                        "block";

                } else {

                    card.style.display =
                        "none";

                }

            });

        }
    );

});


/* =================================================
   REVIEW SYSTEM
================================================= */


/* Ratings */

const reviewRatings = {

    taste: 0,

    visual: 0,

    texture: 0,

    freshness: 0,

    website: 0,

    logo: 0,

    packaging: 0,

    branding: 0

};


/* =================================================
   STAR BUTTONS
================================================= */

document
    .querySelectorAll(".stars")
    .forEach(starContainer => {

        const buttons =
            starContainer.querySelectorAll(
                "button"
            );


        const ratingName =
            starContainer.dataset.rating;


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        Number(
                            button.dataset.value
                        );


                    reviewRatings[
                        ratingName
                    ] = value;


                    buttons.forEach(
                        star => {

                            star.classList.remove(
                                "selected"
                            );

                        }
                    );


                    buttons.forEach(
                        star => {

                            if (
                                Number(
                                    star.dataset.value
                                ) <= value
                            ) {

                                star.classList.add(
                                    "selected"
                                );

                            }

                        }
                    );

                }
            );

        });

    });


/* =================================================
   LOAD REVIEWS
================================================= */

let reviews =
    JSON.parse(
        localStorage.getItem(
            "bakeryReviews"
        )
    ) || [];


/* =================================================
   SAVE REVIEWS
================================================= */

function saveReviews() {

    localStorage.setItem(
        "bakeryReviews",
        JSON.stringify(reviews)
    );

}


/* =================================================
   CALCULATE PRODUCT RATING
================================================= */

function calculateProductRating(review) {

    return (
        review.taste +
        review.visual +
        review.texture +
        review.freshness
    ) / 4;

}


/* =================================================
   CALCULATE BRANDING RATING
================================================= */

function calculateBrandingRating(review) {

    return (
        review.website +
        review.logo +
        review.packaging +
        review.branding
    ) / 4;

}


/* =================================================
   DISPLAY REVIEWS
================================================= */

function displayReviews() {

    const reviewList =
        document.getElementById(
            "reviewList"
        );

    const reviewCount =
        document.getElementById(
            "reviewCount"
        );

    const averageRating =
        document.getElementById(
            "averageRating"
        );


    if (
        !reviewList ||
        !reviewCount ||
        !averageRating
    ) return;


    reviewList.innerHTML = "";


    if (reviews.length === 0) {

        reviewList.innerHTML = `

            <div class="no-reviews">

                <span>
                    ♡
                </span>

                <p>
                    No reviews yet.
                    Be the first to share
                    your experience!
                </p>

            </div>

        `;


        reviewCount.textContent =
            "0";

        averageRating.textContent =
            "0.0";

        return;

    }


    let totalRating = 0;


    reviews.forEach(review => {


        const productRating =
            calculateProductRating(
                review
            );


        const brandingRating =
            calculateBrandingRating(
                review
            );


        const overallRating =
            (
                productRating +
                brandingRating
            ) / 2;


        totalRating +=
            overallRating;


        const roundedRating =
            Math.round(
                overallRating
            );


        const stars =
            "★".repeat(
                roundedRating
            ) +
            "☆".repeat(
                5 - roundedRating
            );


        const reviewElement =
            document.createElement(
                "div"
            );


        reviewElement.className =
            "customer-review";


        reviewElement.innerHTML = `

            <div class="customer-review-header">

                <div>

                    <div class="customer-name">

                        ${escapeHTML(
                            review.name
                        )}

                    </div>


                    <div class="customer-product">

                        ${escapeHTML(
                            review.product
                        )}

                    </div>

                </div>


                <div class="customer-rating">

                    ${stars}

                </div>

            </div>


            <p>

                ${escapeHTML(
                    review.feedback
                )}

            </p>


            <div class="review-tags">

                <span class="review-tag">
                    Taste: ${review.taste}/5
                </span>

                <span class="review-tag">
                    Visual: ${review.visual}/5
                </span>

                <span class="review-tag">
                    Texture: ${review.texture}/5
                </span>

                <span class="review-tag">
                    Freshness: ${review.freshness}/5
                </span>

                <span class="review-tag">
                    Website: ${review.website}/5
                </span>

                <span class="review-tag">
                    Logo: ${review.logo}/5
                </span>

                <span class="review-tag">
                    Packaging: ${review.packaging}/5
                </span>

            </div>

        `;


        reviewList.appendChild(
            reviewElement
        );

    });


    const average =
        totalRating /
        reviews.length;


    averageRating.textContent =
        average.toFixed(1);


    reviewCount.textContent =
        reviews.length;

}


/* =================================================
   SUBMIT REVIEW
================================================= */

document
    .getElementById("reviewForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* Check all ratings */

            const missingRating =
                Object.keys(
                    reviewRatings
                ).find(
                    rating =>
                        reviewRatings[
                            rating
                        ] === 0
                );


            if (missingRating) {

                alert(
                    "Please rate every category before submitting."
                );

                return;

            }


            /* Create review */

            const newReview = {

                name:
                    document
                        .getElementById(
                            "reviewName"
                        )
                        .value,

                product:
                    document
                        .getElementById(
                            "reviewProduct"
                        )
                        .value,

                taste:
                    reviewRatings.taste,

                visual:
                    reviewRatings.visual,

                texture:
                    reviewRatings.texture,

                freshness:
                    reviewRatings.freshness,

                website:
                    reviewRatings.website,

                logo:
                    reviewRatings.logo,

                packaging:
                    reviewRatings.packaging,

                branding:
                    reviewRatings.branding,

                feedback:
                    document
                        .getElementById(
                            "reviewFeedback"
                        )
                        .value,

                recommendation:
                    document
                        .getElementById(
                            "recommendation"
                        )
                        .value,

                date:
                    new Date()
                        .toLocaleDateString()

            };


            /* Add to beginning */

            reviews.unshift(
                newReview
            );


            /* Save */

            saveReviews();


            /* Display */

            displayReviews();


            /* Reset form */

            document
                .getElementById(
                    "reviewForm"
                )
                .reset();


            /* Reset star ratings */

            Object.keys(
                reviewRatings
            ).forEach(key => {

                reviewRatings[key] =
                    0;

            });


            document
                .querySelectorAll(
                    ".stars button"
                )
                .forEach(button => {

                    button.classList.remove(
                        "selected"
                    );

                });


            alert(
                "Thank you for your review! ❤️"
            );

        }
    );


/* =================================================
   ESCAPE HTML
================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =================================================
   INITIALIZE
================================================= */

updateStockDisplay();

renderOrder();

displayReviews();
