// ==========================================
// THE ARTISAN BAKERY - JAVASCRIPT
// Written by: Nanga Shammah Sadiki
// Student Number: ST10490123
// ==========================================

window.onload = function () {

    // ==============================
    // 1. DYNAMIC GREETING
    // ==============================
    var greetingBox = document.getElementById("greeting");
    if (greetingBox) {
        var now = new Date();
        var hour = now.getHours();
        var greeting = "";

        if (hour < 12) {
            greeting = "Good morning! Fresh bread is ready.";
        } else if (hour < 17) {
            greeting = "Good afternoon! Fresh bread is ready.";
        } else {
            greeting = "Good evening! Fresh bread is ready.";
        }

        greetingBox.innerHTML = greeting;
    }

    // ==============================
    // 2. MOBILE MENU TOGGLE
    // ==============================
    var menuButton = document.getElementById("menu-button");
    var navMenu = document.getElementById("nav-menu");

    if (menuButton && navMenu) {
        menuButton.onclick = function () {
            if (navMenu.style.display === "flex") {
                navMenu.style.display = "none";
            } else {
                navMenu.style.display = "flex";
            }
        };
    }

    // ==============================
    // 3. PRODUCT TABS
    // ==============================
    var tabButtons = document.getElementsByClassName("tab-btn");

    if (tabButtons.length > 0) {
        for (var i = 0; i < tabButtons.length; i++) {
            tabButtons[i].onclick = function () {
                var panels = document.getElementsByClassName("tab-panel");
                for (var j = 0; j < panels.length; j++) {
                    panels[j].style.display = "none";
                }

                for (var k = 0; k < tabButtons.length; k++) {
                    tabButtons[k].className = "tab-btn";
                }

                this.className = "tab-btn active";
                var targetId = this.getAttribute("data-tab");
                document.getElementById(targetId).style.display = "block";
            };
        }
    }

    // ==============================
    // 4. LIGHTBOX GALLERY
    // ==============================
    var productImages = document.querySelectorAll(".product-category img");

    for (var m = 0; m < productImages.length; m++) {
        productImages[m].style.cursor = "pointer";
        productImages[m].onclick = function () {
            openLightbox(this.src, this.alt);
        };
    }

    function openLightbox(imageSrc, imageAlt) {
        var overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";

        var closeBtn = document.createElement("span");
        closeBtn.className = "lightbox-close";
        closeBtn.innerHTML = "&times;";

        var bigImage = document.createElement("img");
        bigImage.src = imageSrc;
        bigImage.alt = imageAlt;
        bigImage.className = "lightbox-image";

        overlay.appendChild(closeBtn);
        overlay.appendChild(bigImage);
        document.body.appendChild(overlay);

        closeBtn.onclick = function () {
            document.body.removeChild(overlay);
        };

        overlay.onclick = function (event) {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
    }

    // ==============================
    // 5. PRODUCT SEARCH
    // ==============================
    var searchBox = document.getElementById("product-search");
    if (searchBox) {
        searchBox.onkeyup = function () {
            var searchText = searchBox.value.toLowerCase();
            var products = document.querySelectorAll(".product-category li");

            for (var n = 0; n < products.length; n++) {
                var productName = products[n].textContent.toLowerCase();
                if (productName.indexOf(searchText) > -1) {
                    products[n].style.display = "";
                } else {
                    products[n].style.display = "none";
                }
            }
        };
    }

    // ==============================
    // 6. SHOPPING CART - ADD ITEMS
    // ==============================
    var addButtons = document.getElementsByClassName("add-cart-btn");

    for (var b = 0; b < addButtons.length; b++) {
        addButtons[b].onclick = function () {
            var name = this.getAttribute("data-name");
            var price = parseFloat(this.getAttribute("data-price"));
            addToCart(name, price);
            alert(name + " has been added to your cart!");
        };
    }

    function getCart() {
        var cart = localStorage.getItem("artisanCart");
        if (cart) {
            return JSON.parse(cart);
        } else {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem("artisanCart", JSON.stringify(cart));
    }

    function addToCart(name, price) {
        var cart = getCart();
        var found = false;

        for (var i = 0; i < cart.length; i++) {
            if (cart[i].name === name) {
                cart[i].quantity = cart[i].quantity + 1;
                found = true;
            }
        }

        if (found === false) {
            cart.push({ name: name, price: price, quantity: 1 });
        }

        saveCart(cart);
        updateCartCount();
    }

    function updateCartCount() {
        var counter = document.getElementById("cart-count");
        if (counter) {
            var cart = getCart();
            var total = 0;
            for (var i = 0; i < cart.length; i++) {
                total = total + cart[i].quantity;
            }
            counter.innerHTML = total;
        }
    }

    // ==============================
    // 7. CART PAGE - DISPLAY ITEMS
    // ==============================
    var cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
        showCartItems();
    }

    function showCartItems() {
        var cart = getCart();
        var container = document.getElementById("cart-items");
        var totalBox = document.getElementById("cart-total");
        var checkoutLink = document.getElementById("checkout-link");

        if (cart.length === 0) {
            container.innerHTML = "<p>Your cart is empty. Go to <a href='products.html'>Products</a> to add items.</p>";
            if (totalBox) totalBox.innerHTML = "";
            if (checkoutLink) checkoutLink.style.display = "none";
            return;
        }

        if (checkoutLink) checkoutLink.style.display = "inline-block";

        var table = "<table class='cart-table'><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Action</th></tr>";

        var total = 0;

        for (var i = 0; i < cart.length; i++) {
            var subtotal = cart[i].price * cart[i].quantity;
            total = total + subtotal;

            table += "<tr>";
            table += "<td>" + cart[i].name + "</td>";
            table += "<td>R" + cart[i].price.toFixed(2) + "</td>";
            table += "<td>";
            table += "<button class='qty-btn' onclick='changeQty(" + i + ", -1)'>-</button> ";
            table += cart[i].quantity;
            table += " <button class='qty-btn' onclick='changeQty(" + i + ", 1)'>+</button>";
            table += "</td>";
            table += "<td>R" + subtotal.toFixed(2) + "</td>";
            table += "<td><button class='remove-btn' onclick='removeItem(" + i + ")'>Remove</button></td>";
            table += "</tr>";
        }

        table += "</table>";
        container.innerHTML = table;

        if (totalBox) {
            totalBox.innerHTML = "Total: R" + total.toFixed(2);
        }
    }

    // Functions that buttons call
    window.changeQty = function (index, change) {
        var cart = getCart();
        cart[index].quantity = cart[index].quantity + change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        saveCart(cart);
        showCartItems();
        updateCartCount();
    };

    window.removeItem = function (index) {
        var cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        showCartItems();
        updateCartCount();
    };

    // ==============================
    // 8. CHECKOUT PAGE - SUMMARY
    // ==============================
    var checkoutSummary = document.getElementById("checkout-summary");
    if (checkoutSummary) {
        showCheckoutSummary();
    }

    function showCheckoutSummary() {
        var cart = getCart();
        var summaryBox = document.getElementById("checkout-summary");

        if (cart.length === 0) {
            summaryBox.innerHTML = "<p>Your cart is empty. Please add items first.</p>";
            return;
        }

        var html = "<h3>Your Order</h3><ul>";
        var total = 0;

        for (var i = 0; i < cart.length; i++) {
            var subtotal = cart[i].price * cart[i].quantity;
            total = total + subtotal;
            html += "<li>" + cart[i].name + " x " + cart[i].quantity + " = R" + subtotal.toFixed(2) + "</li>";
        }

        html += "</ul>";
        html += "<p class='cart-total'>Total: R" + total.toFixed(2) + "</p>";

        summaryBox.innerHTML = html;
    }

    // ==============================
    // 9. FORM VALIDATION - ENQUIRY
    // ==============================
    var enquiryForm = document.getElementById("enquiry-form");
    if (enquiryForm) {
        enquiryForm.onsubmit = function (event) {
            event.preventDefault();
            var isValid = true;
            clearErrors();

            var name = document.getElementById("name").value;
            if (name.length < 2) {
                showError("name", "Please enter your full name.");
                isValid = false;
            }

            var email = document.getElementById("email").value;
            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showError("email", "Please enter a valid email address.");
                isValid = false;
            }

            var message = document.getElementById("message").value;
            if (message.length < 10) {
                showError("message", "Please write at least 10 characters.");
                isValid = false;
            }

            if (isValid) {
                alert("Thank you, " + name + "! Your enquiry has been received.");
                enquiryForm.reset();
            }
        };
    }

    // ==============================
    // 10. FORM VALIDATION - CONTACT
    // ==============================
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.onsubmit = function (event) {
            event.preventDefault();
            var isValid = true;
            clearErrors();

            var name = document.getElementById("name").value;
            if (name.length < 2) {
                showError("name", "Please enter your name.");
                isValid = false;
            }

            var email = document.getElementById("email").value;
            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showError("email", "Please enter a valid email.");
                isValid = false;
            }

            var subject = document.getElementById("subject").value;
            if (subject.length < 3) {
                showError("subject", "Please enter a subject.");
                isValid = false;
            }

            var message = document.getElementById("message").value;
            if (message.length < 10) {
                showError("message", "Please write a longer message.");
                isValid = false;
            }

            if (isValid) {
                alert("Thank you, " + name + "! Your message has been sent.");
                contactForm.reset();
            }
        };
    }

    // ==============================
    // 11. FORM VALIDATION - CHECKOUT
    // ==============================
    var checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.onsubmit = function (event) {
            event.preventDefault();
            var isValid = true;
            clearErrors();

            var name = document.getElementById("name").value;
            if (name.length < 2) {
                showError("name", "Please enter your full name.");
                isValid = false;
            }

            var email = document.getElementById("email").value;
            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showError("email", "Please enter a valid email.");
                isValid = false;
            }

            var phone = document.getElementById("phone").value;
            if (phone.length < 7) {
                showError("phone", "Please enter a valid phone number.");
                isValid = false;
            }

            var address = document.getElementById("address").value;
            if (address.length < 5) {
                showError("address", "Please enter your delivery address.");
                isValid = false;
            }

            if (isValid) {
                alert("Thank you, " + name + "! Your order has been placed. We will contact you soon.");
                localStorage.removeItem("artisanCart");
                window.location.href = "index.html";
            }
        };
    }

    // ==============================
    // HELPER FUNCTIONS
    // ==============================
    function showError(fieldId, errorMessage) {
        var input = document.getElementById(fieldId);
        var errorBox = document.getElementById(fieldId + "-error");

        if (input) {
            input.style.borderColor = "red";
        }

        if (errorBox) {
            errorBox.innerHTML = errorMessage;
            errorBox.style.display = "block";
        }
    }

    function clearErrors() {
        var errorBoxes = document.getElementsByClassName("error-msg");
        for (var p = 0; p < errorBoxes.length; p++) {
            errorBoxes[p].innerHTML = "";
            errorBoxes[p].style.display = "none";
        }

        var inputs = document.querySelectorAll("input, textarea, select");
        for (var q = 0; q < inputs.length; q++) {
            inputs[q].style.borderColor = "";
        }
    }

    // ==============================
    // 12. UPDATE CART COUNT ON LOAD
    // ==============================
    updateCartCount();

};