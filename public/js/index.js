import "@babel/polyfill";
import axios from "axios";

$(document).on("click", "#signUp", async function (e) {
  e.preventDefault();
  var firstname = $("#firstname").val();
  var lastname = $("#lastname").val();
  var address = $("#address").val();
  var email = $("#email").val();
  var password = $("#password").val();
  var confirmPassword = $("#confirmPassword").val();
  var phone = $("#phone").val();

  if (
    firstname == "" ||
    lastname == "" ||
    address == "" ||
    email == "" ||
    password == "" ||
    confirmPassword == "" ||
    phone == ""
  ) {
    return alert("Please provide all the information");
  }

  if (password !== confirmPassword) {
    return alert("Passwords do not match");
  }

  try {
    const result = await axios({
      method: "POST",
      data: {
        name: `${firstname} ${lastname}`,
        address,
        email,
        password,
        confirmPassword,
        phone,
      },
      url: "http://localhost:8000/api/v1/users",
    });

    if (result.data.status === "success") {
      alert("Registered Successfully");
      window.location.reload();
    } else {
      alert("Registration failed");
      window.location.reload();
    }
  } catch (error) {
    if (error.response.data.message.includes("duplicate key error")) {
      alert("Email already in use.");
    } else if (error.response.data.message.includes("Cast to Number failed")) {
      alert("Phone number cannot be text");
    } else alert(error.response.data.message);
  }
});

$(document).on("click", "#login", async function (e) {
  e.preventDefault();

  var email = $("#email").val();
  var password = $("#password").val();

  if (email === "" || password == "") {
    return alert("Please provide your email and password");
  }
  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (result.data.status === "success") {
      alert("Login Successful");
      window.location.replace("/");
    } else {
      alert("Invalid Credentials");
    }
  } catch (error) {
    alert(error.response.data.message);
  }
});

$(document).on("click", "#logout", async function (e) {
  e.preventDefault();

  try {
    const result = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/users/logout",
    });

    if (result.data.status === "success") {
      alert("Logged out");
      window.location.replace("/login");
    } else {
      alert("Something went wrong. Please try again");
    }
  } catch (error) {
    alert(error.response.data.message);
  }
});

$(document).on("click", "#reservebook", async function (e) {
  try {
    e.preventDefault();
    const userId = $(this).data("userid");
    const bookId = $(this).data("bookid");

    if (!userId || !bookId) {
      return alert("Something went wrong. Please try again later");
    }

    const result = await axios({
      method: "POST",
      url: `http://localhost:8000/api/v1/book-issue/book/${bookId}/user/${userId}`,
    });

    if (result.data.status === "success") {
      alert("Book has been reserved");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
});

$(document).on("click", "#removereservation", async function (e) {
  e.preventDefault();
  const issueId = $(this).data("issueid");

  try {
    const result = await axios({
      method: "DELETE",
      url: `http://localhost:8000/api/v1/book-issue/${issueId}`,
    });

    if (result.data.status === "success") {
      alert("Your reservation was removed");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
});

$(document).on("click", "#loginAdmin", async function (e) {
  e.preventDefault();
  const email = $("#emailAdmin").val();
  const password = $("#passwordAdmin").val();

  if (email == "" || password == "") {
    return alert("Please provide email and password");
  }

  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/users/login-admin",
      data: {
        email,
        password,
      },
    });

    if (result.data.status === "success") {
      alert("Login successful");
      window.location.replace("/admin/dashboard");
    }
  } catch (error) {
    console.log(error);
    alert("Invalid credentials");
  }
});

$(document).on("click", "#logoutAdmin", async function (e) {
  e.preventDefault();

  try {
    const result = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/users/logout",
    });

    if (result.data.status === "success") {
      alert("Logged out");
      window.location.replace("/admin");
    } else {
      alert("Something went wrong. Please try again");
    }
  } catch (error) {
    alert(error.response.data.message);
  }
});

$(document).on("click", "#updateStock", async function (e) {
  e.preventDefault();
  const bookId = $(this).data("bookid");
  const newStock = $(this).prev().val();

  if (!newStock) {
    return alert("Please provide an quantity");
  }

  try {
    const result = await axios({
      method: "PATCH",
      data: {
        quantity: newStock,
      },
      url: `http://localhost:8000/api/v1/books/${bookId}`,
    });

    if (result.data.status === "success") {
      alert("Stock updated");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
});

$(document).on("click", "#addbook", async function (e) {
  e.preventDefault();
  const name = $("#name").val();
  const authors = $("#authors").val();
  const category = $("#category").val();
  const publishedDate = $("#publishedDate").val();
  const quantity = $("#quantity").val();
  const details = $("#details").val();
  var image = $("#image").prop("files")[0];

  alert(category);
  if (
    name === "" ||
    authors === "" ||
    category === "" ||
    publishedDate === "" ||
    quantity === ""
  ) {
    return alert("Please fill all the fields");
  }

  if (quantity <= 0) {
    return alert("Quantity should greater than 1");
  }

  const authorArr = authors.split(",");
  const filteredArr = [];
  authorArr.forEach((auth) => {
    if (auth.trim() !== "") {
      filteredArr.push(auth.trim());
    }
  });

  const form = new FormData();
  form.append("image", image);
  form.append("name", name);
  form.append("quantity", quantity);
  form.append("category", category);
  form.append("publishedAt", publishedDate);
  form.append("details", details);

  filteredArr.forEach((el) => {
    form.append("author", el);
  });

  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/books",
      data: form,
    });

    if (result.data.status === "success") {
      alert("Book added");
      window.location.reload();
    }
  } catch (error) {
    if (error.response.data.message.includes("duplicate key error"))
      return alert("Book under this name has already been added");
    alert("Something went wrong");
  }
});

$(document).on("click", "#pickedup", async function (e) {
  e.preventDefault();
  const issueId = $(this).data("issueid");

  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/v1/book-issue/issue/${issueId}`,
    });

    if (result.data.status === "success") {
      alert("Book issued");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
});

$(document).on("click", "#returned", async function (e) {
  e.preventDefault();
  const issueId = $(this).data("issueid");
  const bookId = $(this).data("bookid");

  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/v1/book-issue/${issueId}/return/${bookId}`,
    });

    if (result.data.status === "success") {
      alert("Book was returned");
      window.location.reload();
    }
  } catch (error) {
    alert("Something went wrong");
  }
});

$(document).on("click", "#lateReturned", async function (e) {
  e.preventDefault();
  const issueId = $(this).data("issueid");
  const bookId = $(this).data("bookid");
  const fine = $(this).prev().val();

  if (!fine || fine <= 0) {
    return alert("Please provide fine amount");
  }

  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/v1/book-issue/${issueId}/return/${bookId}`,
      data: {
        fine,
      },
    });

    if (result.data.status === "success") {
      alert("Book was returned");
      window.location.reload();
    }
  } catch (error) {
    alert("Something went wrong");
  }
});

$(document).on("click", "#filter", function (e) {
  e.preventDefault();
  // const status = $("input[name='isActive']:checked");
  const filters = [];
  $.each($("input[name='isActive']:checked"), function () {
    filters.push($(this).val());
  });
  let filterString = "";
  filters.forEach((el, i) => {
    if (i + 1 === filters.length) filterString += `status=${el}`;
    else filterString += `status=${el}&`;
  });

  const userEmail = $("#searchValue").val();
  if (userEmail !== "" && filterString === "")
    filterString += `email=${userEmail}`;
  else if (userEmail !== "" && filterString !== "")
    filterString += `&email=${userEmail}`;
  window.location.replace(`/admin/dashboard/book-issues?${filterString}`);
});

let bookToBeIssuedByAdmin = "";
let bookToBeIssuedToUser = "";

$(document).on("click", "#issuebyadmin", function (e) {
  e.preventDefault();
  bookToBeIssuedByAdmin = $(this).data("bookid");
  $("#email").val("");
  $("#user-detail").html("");
});

$(document).on("click", "#getuserdetail", async function (e) {
  e.preventDefault();
  const email = $("#email").val();
  if (email == "") {
    return alert("Please enter your email");
  }

  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/users/user-by-email",
      data: {
        email,
      },
    });

    if (res.data.status === "success") {
      if (res.data.user) {
        bookToBeIssuedToUser = res.data.user._id;

        $("#user-detail").html(
          `<p> Name: ${res.data.user.name.toUpperCase()} </p>
          <p> Address: ${res.data.user.address.toUpperCase()}</p> 
          <button class="btn btn-default" id="confirmIssue">CONFIRM</button>
          `
        );
      } else {
        alert("User not found");
        bookToBeIssuedToUser = "";
        $("#user-detail").html("");
      }
    } else {
      return alert("Invalid credentail");
      bookToBeIssuedToUser = "";
      $("#user-detail").html("");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
});

$(document).on("click", "#confirmIssue", async function (e) {
  e.preventDefault();

  try {
    const result = await axios({
      method: "POST",
      url: `http://localhost:8000/api/v1/book-issue/issue/admin/${bookToBeIssuedByAdmin}`,
      data: {
        user: bookToBeIssuedToUser,
      },
    });

    if (result.data.status === "success") {
      alert("Book Issued");
      window.location.reload();
    }
  } catch (error) {
    // console.log(error);
    alert(error.response.data.message);
  }
});
