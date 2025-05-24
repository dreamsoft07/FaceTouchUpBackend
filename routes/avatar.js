import express from "express";
import axios from "axios";
import FormData from "form-data";

const router = express.Router();

// POST /api/avatar/init
router.post("/init", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.API_BASE}/avatar/init`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.BACKEND_AUTH_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// POST /api/avatar/:id/create
router.post("/:id/create", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.post(
      `${process.env.API_BASE}/avatar/${id}/create`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.BACKEND_AUTH_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET /api/avatar/:id/status
router.get("/:id/status", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `${process.env.API_BASE}/avatar/${id}/get_status`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BACKEND_AUTH_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

router.post("/remove-bg", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const image = req.files.file; // via express-fileupload
    const formData = new FormData();
    formData.append("file", image.data, image.name);

    const response = await axios.post(`${process.env.BACKGROUND_REMOVE_URL}`, formData, {
      headers: {
        ...formData.getHeaders(),
        APIKEY: `${process.env.BACKGROUND_REMOVE_URL_API_KEY}`,
        // ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// POST /avatar/upload
router.post("/upload", async (req, res) => {
  try {
    const { presignedUrl } = req.body;

    if (!req.files || !req.files.file || !presignedUrl) {
      return res.status(400).json({ error: "Missing file or presigned URL" });
    }

    const file = req.files.file;

    const response = await axios.put(presignedUrl, file.data, {
      headers: {
        "Content-Type": file.mimetype,
        "Content-Length": file.size,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    console.error("Upload to presigned URL failed:", error.message);
    res.status(500).json({ error: "Failed to upload to presigned URL" });
  }
});

router.get("/:avatarId/get_3d_model/blendshapes", async (req, res) => {
  const { avatarId } = req.params;
  console.log("✅ avatarId => ", avatarId);

  const apiUrl = `${process.env.API_BASE}/avatar/${avatarId}/get_3d_model/neutral_with_blendshapes_glb`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.BACKEND_AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch model" });
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    res.set({
      "Content-Type": "model/gltf-binary",
      "Content-Disposition": `attachment; filename=avatar_${avatarId}.glb`,
    });

    res.send(buffer);
  } catch (err) {
    console.error("Error proxying model:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:avatarId/get_3d_model/single_head", async (req, res) => {
  const { avatarId } = req.params;

  try {
    const response = await fetch(
      `${process.env.API_BASE}/avatar/${avatarId}/get_3d_model/single_head?mesh_type=glb&resolution=high_poly`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.BACKEND_AUTH_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch single head model" });
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    res.set({
      "Content-Type": "model/gltf-binary",
      "Content-Disposition": `attachment; filename=avatar_${avatarId}_single_head.glb`,
    });

    res.send(buffer);
  } catch (err) {
    console.error("Error fetching single head model:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
