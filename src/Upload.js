import React from "react";
import { post, get } from "axios";

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      upFile: null,
      getFile: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.getFile = this.getFile.bind(this);
  }

  handleChange = ({ target }) => {
    this.setState({
      upFile: target.files[0]
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const respUpFile = await this.uploadFile(this.state.upFile);

    if (respUpFile.status !== 200) {
      return;
    }

    const { file_id } = respUpFile.data;
    if (file_id == null) {
      return;
    }

    const respGetFile = await this.getFile(file_id);
    let base64String = Buffer.from(respGetFile.data, "binary").toString(
      "base64"
    );

    this.setState({
      getFile: base64String
    });
  };

  uploadFile = file => {
    const url = "http://18.136.200.16/api/v1.0/file-upload";
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    return post(url, formData, config);
  };

  getFile = id => {
    const url = "http://18.136.200.16/api/v1.0/file-upload/" + id;
    return get(url, { responseType: "arraybuffer" });
  };

  render() {
    const { getFile } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            accept="image/png, image/jpeg"
            onChange={this.handleChange}
            type="file"
            required
          />
          <input type="submit" value="Submit" />
        </form>
        {getFile && <img src={`data:image/jpeg;base64,${getFile}`} alt="" />}
      </div>
    );
  }
}

export default Upload;
