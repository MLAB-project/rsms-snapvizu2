with (import <nixpkgs> {});
stdenv.mkDerivation {
    name = "disprel";
    buildInputs = [ python3 python3Packages.cherrypy ];
}
