class ApiResponse {
    constructor(success, msg, data = null) {
        this.success = success;
        this.msg = msg;
        this.data = data;
    }
}

export { ApiResponse };