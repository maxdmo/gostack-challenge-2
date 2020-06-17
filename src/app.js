const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function isValidUuid(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).send({error:"Id is not valid!"});
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs} = request.body;

  const repository = {
    id:uuid(),
    title,
    url,
    techs,
    likes:0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", isValidUuid, (request, response) => {
 
  const { id }= request.params;

  const { title ,url ,techs}= request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0){
    return response.status(404).response.json({message:"Repository does not exist!"})
  }

  const oldRepo = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes: oldRepo.likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", isValidUuid, (request, response) => {
 
  const { id }= request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(404).response.json({message:"Repository does not exist!"});
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", isValidUuid,(request, response) => {

  const { id }= request.params;


  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0){
    return response.status(404).response.json({message:"Repository does not exist!"});
  }

  const oldRepo = repositories[repoIndex];

  const repo = {
    ...oldRepo,
    likes:oldRepo.likes + 1
  };

  repositories[repoIndex] = repo;

  return response.json(repo)
});

module.exports = app;