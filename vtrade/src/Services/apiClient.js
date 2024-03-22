import axios from "axios";

class ApiClient {
  constructor(remoteHostUrl) {
    this.remoteHostUrl = remoteHostUrl;
    this.token = null;
    this.tokenName = "vtrade_token";
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem(this.tokenName, token);
  }

  async request({
    endpoint,
    method = `GET`,
    data = {},
    contentType = "application/json",
  }) {
    const url = `${this.remoteHostUrl}/${endpoint}`;
    const headers = {
      "Content-Type": contentType,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const res = await axios({ url, method, data, headers });
      return { data: res.data, error: null };
    } catch (error) {
      console.error({ errorResponse: error.response });
      const message = error?.response?.data?.error?.message;
      return { data: null, error: message || String(error) };
    }
  }

  async fetchUserFromToken() {
    return await this.request({ endpoint: `user/me`, method: `GET` });
  }

  // async fetchUserFromId(userId) {
  //   return await this.request({ endpoint: `auth/` + userId, method: `GET` });
  // }

  async loginUser(credentials) {
    return await this.request({
      endpoint: `user/login`,
      method: `POST`,
      data: credentials,
    });
  }

  async logoutUser() {
    this.setToken(null);
    localStorage.setItem(this.tokenName, "");
  }

  async signupUser(credentials) {
    return await this.request({
      endpoint: `user/register`,
      method: `POST`,
      data: credentials,
    });
  }

  async getHighlights() {
    return await this.request({
      endpoint: `offer/highlights`,
      method: `GET`,
    });
  }

  async getListings() {
    return await this.request({
      endpoint: `listing`,
      method: `GET`,
    });
  }

  async postItem(data) {
    return await this.request({
      endpoint: `listing/item`,
      method: `POST`,
      data: data,
      contentType: "multipart/form-data",
    });
  }

  async getProduct(id) {
    return await this.request({
      endpoint: `listing/item/${id}`,
      method: `GET`,
    });
  }

  async getUser(id) {
    return await this.request({
      endpoint: `user/${id}`,
      method: `GET`,
    });
  }
  async getListingsByCategory(data) {
    return await this.request({
      endpoint: `listing/category/${data.categoryId}`,
      method: "GET",
      params: data,
    });
  }

  async getListingsByFilter(data) {
    try {
      const queryString = Object.keys(data)
        .map((key) => `${key}=${encodeURIComponent(data[key])}`)
        .join("&");

      return await this.request({
        endpoint: `listing/filtering?${queryString}`,
        method: "GET",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

export default new ApiClient("http://localhost:3001");
