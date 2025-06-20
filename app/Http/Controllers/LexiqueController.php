<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LexiqueController extends Controller
{
    private string $jsonPath = 'lexique_poker.json';

    private function lireJson(): array
    {
        $chemin = storage_path("app/{$this->jsonPath}");
        if (!file_exists($chemin)) {
            return [];
        }
        return json_decode(file_get_contents($chemin), true) ?? [];
    }

    private function ecrireJson(array $data): void
    {
        file_put_contents(storage_path("app/{$this->jsonPath}"), json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    public function index()
    {
        return response()->json($this->lireJson());
    }

    public function store(Request $request)
    {
        $donnees = $request->only(['Catégorie', 'Terme', 'Définition']);
        $donnees['id'] = (string) Str::uuid();

        $lexique = $this->lireJson();
        $lexique[] = $donnees;

        $this->ecrireJson($lexique);

        return response()->json($donnees, 201);
    }

    public function update(Request $request, $id)
    {
        $modifications = $request->only(['Catégorie', 'Terme', 'Définition']);
        $lexique = $this->lireJson();

        foreach ($lexique as &$item) {
            if (isset($item['id']) && $item['id'] === $id) {
                $item = array_merge($item, $modifications);
                $this->ecrireJson($lexique);
                return response()->json($item);
            }
        }

        return response()->json(['message' => 'Terme non trouvé'], 404);
    }

    public function destroy($id)
    {
        $lexique = $this->lireJson();
        $nouveauLexique = array_filter($lexique, fn($item) => $item['id'] !== $id);

        if (count($nouveauLexique) === count($lexique)) {
            return response()->json(['message' => 'Terme non trouvé'], 404);
        }

        $this->ecrireJson(array_values($nouveauLexique));

        return response()->json(['message' => 'Terme supprimé']);
    }
}
