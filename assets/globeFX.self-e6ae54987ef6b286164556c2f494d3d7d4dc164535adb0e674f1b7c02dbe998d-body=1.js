var t = (function () {

    var quadOneVerts = [],
        quadTwoVerts = [],
        quadThreeVerts = [],
        quadFourVerts = []

    var searchDistance = 60,
        doubleSearchDistance = searchDistance * 2

    return {
        init: function () {
            t.buildVertexArrays()
        },
        run: function () {
            var vertexObjects = t.selectVertices()
            var counter = 0;

            for (var i = 0; i < vertexObjects.length; i++) {
                t.runOneRipple(vertexObjects[i])
                counter += 100
            }
        },
        runOneRipple: function (vertexObject) {
            var vertex = vertexObject.vertex
            var sprite = t.getSprite(vertexObject.index)
            var siblingsObject = t.findSiblings(vertex)
            t.glowSprite(sprite, 800)
            setTimeout(function () {
                t.undulateVertex(vertex, sprite, 30, 700)
            }, 200)

            var counter = 0
            for (var i = 0; i < siblingsObject.length; i++) {
                var sibling = t.getSprite(siblingsObject[i].index)
                siblingDelayHax(siblingsObject[i].vertex, sibling, counter)
                counter += 100
            }

            function siblingDelayHax(vertex, sibling, counter) {
                setTimeout(function () {
                    t.glowSprite(sibling, 800)
                    t.undulateVertex(vertex, sibling, 15, 500)
                }, counter)
            }

        },
        getSprite: function (index) {
            var sprite
            for (var i = 0; i < spriteRefs.length; i++) {
                if (spriteRefs[i].index == index) {
                    sprite = spriteRefs[i].sprite
                    break
                }
            }
            return sprite
        },
        glowSprite: function (sprite, degree) {
            var scaleInterval = setInterval(function () {
                scaleSprite(sprite, 'pos')
            }, 100)
            setTimeout(function () {
                clearInterval(scaleInterval)
                scaleInterval = setInterval(function () {
                    scaleSprite(sprite, 'neg')
                }, 100)
                setTimeout(function () {
                    clearInterval(scaleInterval)
                }, degree)
            }, degree)
        },
        unglowAllSprites: function () {
            if (Detector.webgl)
                for (var i = 0; i < spriteRefs.length; i++)
                    spriteRefs[i].sprite.scale.set(0, 0, 0)
        },
        undulateVertex: function (sphereVertex, sprite, intensity, time) {
            var initVal,
                finalVal,
                firstTweenFrom,
                secondTweenFrom,
                d = getAxisAndDirection(sphereVertex),
                axis = d[0],
                dir = d[1],
                targetPos;

            if (axis == 'x') {
                initVal = {x: sphereVertex.x}
                targetPos = initVal.x + dir * intensity
                finalVal = {x: targetPos}
            } else if (axis == 'y') {
                initVal = {y: sphereVertex.y}
                targetPos = initVal.y + dir * intensity
                finalVal = {y: targetPos}
            } else if (axis == 'z') {
                initVal = {z: sphereVertex.z}
                targetPos = initVal.z + dir * intensity
                finalVal = {z: targetPos}
            }

            firstTweenFrom = jQuery.extend({}, initVal)

            secondTweenFrom = finalVal

            var tween = new TWEEN.Tween(firstTweenFrom).to(finalVal, time)
                .easing(TWEEN.Easing.Sinusoidal.In)
                .onUpdate(function () {
                    if (axis == 'x') {
                        sphereVertex.x = firstTweenFrom.x
                    } else if (axis == 'y') {
                        sphereVertex.y = firstTweenFrom.y
                    } else if (axis == 'z') {
                        sphereVertex.z = firstTweenFrom.z
                    }
                })

            var backTween = new TWEEN.Tween(secondTweenFrom).to(initVal, time)
                .easing(TWEEN.Easing.Sinusoidal.Out)
                .onUpdate(function () {
                    if (axis == 'x') {
                        sphereVertex.x = secondTweenFrom.x
                    } else if (axis == 'y') {
                        sphereVertex.y = secondTweenFrom.y
                    } else if (axis == 'z') {
                        sphereVertex.z = secondTweenFrom.z
                    }
                })

            var tween2 = new TWEEN.Tween(firstTweenFrom).to(finalVal, time)
                .easing(TWEEN.Easing.Quartic.In)
                .onUpdate(function () {
                    if (axis == 'x') {
                        sprite.position.x = firstTweenFrom.x
                    } else if (axis == 'y') {
                        sprite.position.y = firstTweenFrom.y
                    } else if (axis == 'z') {
                        sprite.position.z = firstTweenFrom.z
                    }
                })

            var backTween2 = new TWEEN.Tween(secondTweenFrom).to(initVal, time)
                .easing(TWEEN.Easing.Quartic.Out)
                .onUpdate(function () {
                    if (axis == 'x') {
                        sprite.position.x = secondTweenFrom.x
                    } else if (axis == 'y') {
                        sprite.position.y = secondTweenFrom.y
                    } else if (axis == 'z') {
                        sprite.position.z = secondTweenFrom.z
                    }
                })

            tween.chain(backTween);
            tween2.chain(backTween2);

            tween.start();
            tween2.start()
        },
        findSiblings: function (vertex) {
            var siblingVertices = []
            for (var i = 0; i < outerPointsGeometry.vertices.length; i++) {
                var suspect = outerPointsGeometry.vertices[i]
                if (numIsInRange(suspect.x, vertex.x, searchDistance) && numIsInRange(suspect.y, vertex.y, searchDistance)
                    && numIsInRange(suspect.z, vertex.z, searchDistance) && !numVertexIsEqual(suspect, vertex)) {
                    siblingVertices.push({vertex: suspect, index: i})
                }
            }
            return siblingVertices
        },
        selectVertices: function () {
            var selectedVertices = [quadOneVerts[getRandomInt(0, quadOneVerts.length)],
                quadTwoVerts[getRandomInt(0, quadTwoVerts.length)],
                quadThreeVerts[getRandomInt(0, quadThreeVerts.length)],
                quadFourVerts[getRandomInt(0, quadFourVerts.length)],
                quadOneVerts[getRandomInt(0, quadOneVerts.length)]]

            while (vertexIsTooCloseToOthers(selectedVertices[0], selectedVertices)) {
                selectedVertices[0] = quadOneVerts[getRandomInt(0, quadOneVerts.length)]
            }
            while (vertexIsTooCloseToOthers(selectedVertices[1], selectedVertices)) {
                selectedVertices[1] = quadTwoVerts[getRandomInt(0, quadTwoVerts.length)]
            }
            while (vertexIsTooCloseToOthers(selectedVertices[2], selectedVertices)) {
                selectedVertices[2] = quadThreeVerts[getRandomInt(0, quadThreeVerts.length)]
            }
            while (vertexIsTooCloseToOthers(selectedVertices[3], selectedVertices)) {
                selectedVertices[3] = quadFourVerts[getRandomInt(0, quadFourVerts.length)]
            }
            while (vertexIsTooCloseToOthers(selectedVertices[4], selectedVertices)) {
                selectedVertices[4] = quadOneVerts[getRandomInt(0, quadOneVerts.length)]
            }

            return selectedVertices

            function vertexIsTooCloseToOthers(suspect, others) {
                for (var i = 0; i < others.length; i++) {
                    if (verticesAreTooClose(suspect, others[i]))
                        return true
                }
                return false
            }

            function verticesAreTooClose(v1, v2) {
                if (numIsInRange(v1.x, v2.x, searchDistance))
                    return !numIsInRange(v1.y, v2.y, doubleSearchDistance) && !numIsInRange(v1.z, v2.z, doubleSearchDistance)
                else if (numIsInRange(v1.y, v2.y, searchDistance))
                    return !numIsInRange(v1.x, v2.x, doubleSearchDistance) && !numIsInRange(v1.z, v2.z, doubleSearchDistance)
                else if (numIsInRange(v1.z, v2.z, searchDistance))
                    return !numIsInRange(v1.x, v2.x, doubleSearchDistance) && !numIsInRange(v1.y, v2.y, doubleSearchDistance)
                else
                    return false
            }

        },
        buildVertexArrays: function () {
            var sphereVertices = outerSphereGeometry.vertices

            for (var i = 0; i < sphereVertices.length; i++) {
                //x+ z+
                if (sphereVertices[i].x > 0 && sphereVertices[i].z > 0)
                    quadOneVerts.push({vertex: sphereVertices[i], index: i})
                //x+ z-
                else if (sphereVertices[i].x > 0 && sphereVertices[i].z < 0)
                    quadTwoVerts.push({vertex: sphereVertices[i], index: i})
                //x- z+
                else if (sphereVertices[i].x < 0 && sphereVertices[i].z > 0)
                    quadThreeVerts.push({vertex: sphereVertices[i], index: i})
                //x- z-
                else if (sphereVertices[i].x < 0 && sphereVertices[i].z < 0)
                    quadFourVerts.push({vertex: sphereVertices[i], index: i})
            }
        },
        zoomGlobe: function () {
            controls.autoRotateSpeed = 1
            var i = 0
            var intervalKill = setInterval(function () {
                for (var u = 0; u < 8; u++)
                    dollyHook(1.0025)

                i++
                if (i > 40) {
                    clearInterval(intervalKill)
                }
            }, 1000 / 60)
        },
        unzoomGlobe: function () {
            controls.autoRotateSpeed = 2
            var i = 0
            var intervalKill = setInterval(function () {
                for (var u = 0; u < 8; u++)
                    dollyHook(.9975)
                i++
                if (i > 40) {
                    clearInterval(intervalKill)
                    controls.autoRotateSpeed = 3
                }
            }, 1000 / 60)
        }
    };

    function scaleSprite(sprite, dir) {
        var scalar = dir == 'pos' ? 5 : -5;
        sprite.scale.x += scalar
        sprite.scale.y += scalar
        sprite.scale.z += scalar
    }

    function getAxisAndDirection(vertex) {
        var axisVal = norm(vertex.x),
            axis = 'x',
            dir = 1;

        if (vertex.x <= 0)
            dir = -1
        if (norm(vertex.y) > axisVal) {
            axisVal = norm(vertex.y)
            axis = 'y'
            dir = vertex.y <= 0 ? -1 : 1;
        }
        if (norm(vertex.z) > axisVal) {
            axis = 'z'
            dir = vertex.z <= 0 ? -1 : 1;
        }

        return [axis, dir]
    }

})();
