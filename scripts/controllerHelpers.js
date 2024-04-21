const createDocument = (Model, modelName) => {
  return async (req, res) => {
    try {
      const document = new Model(req.body);
      await document.save();
      res.status(201).json({ message: `${modelName} created successfully`, document });
    } catch (error) {
      res.status(500).json({ message: `Error creating ${modelName}`, error: error.message });
    }
  };
};

// Higher-order function for fetching all documents
const getAllDocuments = (Model, modelName) => {
  return async (req, res) => {
    try {
      const documents = await Model.find(req.query);
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: `Error fetching ${modelName}`, error: error.message });
    }
  };
};

// Higher-order function for fetching a single document by ID
const getDocumentById = (Model, modelName) => {
  return async (req, res) => {
    try {
      const document = await Model.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: `${modelName} not found` });
      }
      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ message: `Error fetching ${modelName}`, error: error.message });
    }
  };
};

// Higher-order function for updating a document by ID
const updateDocumentById = (Model, modelName) => {
  return async (req, res) => {
    try {
      const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!document) {
        return res.status(404).json({ message: `${modelName} not found` });
      }
      res.status(200).json({ message: `${modelName} updated successfully`, document });
    } catch (error) {
      res.status(500).json({ message: `Error updating ${modelName}`, error: error.message });
    }
  };
};

const deleteDocumentById = (Model, modelName) => {
    return async (req, res) => {
    try {
      const classroom = await Model.findByIdAndDelete(req.params.id);
      if (!classroom) {
        return res.status(404).json({ message: `${modelName} not found` });
      }
      res.status(200).json({ message:  `${modelName} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: `Error deleting ${modelName}`, error: error.message });
    }
  };
};

module.exports = {createDocument, getAllDocuments, getDocumentById, updateDocumentById, deleteDocumentById};